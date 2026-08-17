import logging
import asyncio
import re
from datetime import datetime, timezone
try:
    from bson import ObjectId
except ImportError:
    import uuid
    class ObjectId(str):
        def __new__(cls, val=None):
            if val is None:
                val = uuid.uuid4().hex[:24]
            return super().__new__(cls, str(val))

from app.config import settings


logger = logging.getLogger("bookcycle.database")

# In-memory mock engine for evaluation / offline fallback
class InMemoryCursor:
    def __init__(self, docs):
        self.docs = list(docs)

    def sort(self, key_or_list, direction=1):
        if not key_or_list:
            return self
        field = None
        reverse = False
        if isinstance(key_or_list, list) and len(key_or_list) > 0:
            field, dir_val = key_or_list[0]
            reverse = dir_val == -1
        elif isinstance(key_or_list, str):
            field = key_or_list
            reverse = direction == -1
        
        if field:
            def sort_key(doc):
                val = doc.get(field)
                if val is None:
                    return (1, 0)
                if isinstance(val, (int, float)):
                    return (0, val)
                if isinstance(val, datetime):
                    return (0, val.timestamp())
                return (0, str(val))

            self.docs.sort(key=sort_key, reverse=reverse)
        return self


    def skip(self, n):
        self.docs = self.docs[n:]
        return self

    def limit(self, n):
        self.docs = self.docs[:n]
        return self

    def __aiter__(self):
        self._iter = iter(self.docs)
        return self

    async def __anext__(self):
        try:
            return next(self._iter)
        except StopIteration:
            raise StopAsyncIteration


class InMemoryCollection:
    def __init__(self, name):
        self.name = name
        self.documents = []

    def _matches_filter(self, doc, query):
        if not query:
            return True
        for key, val in query.items():
            if key == "$or":
                matched_any = False
                for sub_q in val:
                    if self._matches_filter(doc, sub_q):
                        matched_any = True
                        break
                if not matched_any:
                    return False
                continue

            doc_val = doc.get(key)
            if isinstance(val, dict):
                if "$regex" in val:
                    pattern = val["$regex"]
                    options = val.get("$options", "")
                    flags = re.IGNORECASE if "i" in options else 0
                    if not doc_val or not re.search(pattern, str(doc_val), flags):
                        return False
                if "$gte" in val and not (doc_val is not None and doc_val >= val["$gte"]):
                    return False
                if "$lte" in val and not (doc_val is not None and doc_val <= val["$lte"]):
                    return False
                if "$in" in val and doc_val not in val["$in"]:
                    return False
            else:
                if str(doc_val) != str(val):
                    return False
        return True

    def find(self, query=None):
        query = query or {}
        matched = [doc.copy() for doc in self.documents if self._matches_filter(doc, query)]
        return InMemoryCursor(matched)

    async def find_one(self, query):
        cursor = self.find(query)
        if cursor.docs:
            return cursor.docs[0].copy()
        return None

    async def insert_one(self, doc):
        new_doc = doc.copy()
        if "_id" not in new_doc:
            new_doc["_id"] = ObjectId()
        self.documents.append(new_doc)
        class InsertResult:
            inserted_id = new_doc["_id"]
        return InsertResult()

    async def insert_many(self, docs):
        inserted_ids = []
        for d in docs:
            new_doc = d.copy()
            if "_id" not in new_doc:
                new_doc["_id"] = ObjectId()
            self.documents.append(new_doc)
            inserted_ids.append(new_doc["_id"])
        class InsertManyResult:
            def __init__(self, ids):
                self.inserted_ids = ids
        return InsertManyResult(inserted_ids)


    async def update_one(self, query, update):
        matched = False
        for doc in self.documents:
            if self._matches_filter(doc, query):
                if "$set" in update:
                    for k, v in update["$set"].items():
                        doc[k] = v
                matched = True
                break
        class UpdateResult:
            matched_count = 1 if matched else 0
            modified_count = 1 if matched else 0
        return UpdateResult()

    async def update_many(self, query, update):
        count = 0
        for doc in self.documents:
            if self._matches_filter(doc, query):
                if "$set" in update:
                    for k, v in update["$set"].items():
                        doc[k] = v
                count += 1
        class UpdateResult:
            matched_count = count
            modified_count = count
        return UpdateResult()

    async def delete_one(self, query):
        for i, doc in enumerate(self.documents):
            if self._matches_filter(doc, query):
                del self.documents[i]
                break
        class DeleteResult:
            deleted_count = 1
        return DeleteResult()

    async def delete_many(self, query):
        initial = len(self.documents)
        self.documents = [d for d in self.documents if not self._matches_filter(d, query)]
        class DeleteResult:
            deleted_count = initial - len(self.documents)
        return DeleteResult()

    async def count_documents(self, query):
        count = 0
        for doc in self.documents:
            if self._matches_filter(doc, query):
                count += 1
        return count

    async def distinct(self, key, filter=None):
        results = set()
        for doc in self.documents:
            if filter is None or self._matches_filter(doc, filter):
                val = doc.get(key)
                if val is not None and str(val).strip():
                    results.add(val)
        return list(results)

    async def create_index(self, *args, **kwargs):
        return None


class InMemoryDatabase:
    def __init__(self):
        self.collections = {}

    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = InMemoryCollection(name)
        return self.collections[name]

    def __getattr__(self, name):
        return self[name]



class Database:
    client = None
    db = None
    is_fallback = False

db_instance = Database()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=2000
        )
        # Test connection
        await client.admin.command('ping')
        db_instance.client = client
        db_instance.db = db_instance.client[settings.DATABASE_NAME]
        db_instance.is_fallback = False
        logger.info(f"Successfully connected to MongoDB database: {settings.DATABASE_NAME}")
        await create_indexes()
    except Exception as e:
        logger.warning(f"MongoDB not reachable ({e}). Initializing high-speed resilient in-memory database engine.")
        db_instance.db = InMemoryDatabase()
        db_instance.is_fallback = True
        # Pre-seed fallback database
        await seed_fallback_db()

async def close_mongo_connection():
    if db_instance.client and not db_instance.is_fallback:
        logger.info("Closing MongoDB connection...")
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

async def create_indexes():
    """Create essential MongoDB indexes for performant queries and constraints."""
    if db_instance.db is None or db_instance.is_fallback:
        return
    try:
        # Users indexes
        await db_instance.db.users.create_index("email", unique=True)
        await db_instance.db.users.create_index("role")

        # Books indexes
        await db_instance.db.books.create_index([
            ("title", "text"),
            ("author", "text"),
            ("subject", "text"),
            ("description", "text"),
            ("course", "text")
        ])
        await db_instance.db.books.create_index("category")
        await db_instance.db.books.create_index("mode")
        await db_instance.db.books.create_index("status")
        await db_instance.db.books.create_index("owner_id")
        await db_instance.db.books.create_index("created_at")

        # Wishlist indexes
        await db_instance.db.wishlist.create_index([("user_id", 1), ("book_id", 1)], unique=True)

        # Messages indexes
        await db_instance.db.messages.create_index([("sender_id", 1), ("receiver_id", 1)])
        await db_instance.db.messages.create_index("book_id")
        await db_instance.db.messages.create_index("created_at")

        # Transactions indexes
        await db_instance.db.transactions.create_index("book_id")
        await db_instance.db.transactions.create_index("buyer_id")
        await db_instance.db.transactions.create_index("seller_id")
        await db_instance.db.transactions.create_index("status")

        # Reviews indexes
        await db_instance.db.reviews.create_index("reviewed_user_id")
        await db_instance.db.reviews.create_index("reviewer_id")
        await db_instance.db.reviews.create_index("transaction_id", unique=True)

        # Reports indexes
        await db_instance.db.reports.create_index("status")
        await db_instance.db.reports.create_index("reporter_id")
        
        logger.info("MongoDB indexes verified/created successfully.")
    except Exception as e:
        logger.warning(f"Error creating indexes: {e}")

def get_database():
    return db_instance.db

def get_collection(name: str):
    if db_instance.db is None:
        db_instance.db = InMemoryDatabase()
        db_instance.is_fallback = True
    return db_instance.db[name]

def parse_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception:
        return None

def format_doc(doc: dict) -> dict:
    """Helper to convert MongoDB _id to string id in documents."""
    if not doc:
        return None
    doc_copy = dict(doc)
    if "_id" in doc_copy:
        doc_copy["id"] = str(doc_copy["_id"])
        del doc_copy["_id"]
    return doc_copy

async def seed_fallback_db():
    """Populate in-memory fallback database with rich demo data so all features work immediately."""
    try:
        from app.utils.seed import DEMO_USERS, get_demo_books
        users_col = get_collection("users")
        books_col = get_collection("books")
        reviews_col = get_collection("reviews")

        user_ids = []
        for u in DEMO_USERS:
            res = await users_col.insert_one(u)
            user_ids.append(str(res.inserted_id))

        if len(user_ids) >= 3:
            demo_books = get_demo_books(user_ids[0], user_ids[1], user_ids[2])
            for b in demo_books:
                await books_col.insert_one(b)

            # Insert sample reviews
            now = datetime.now(timezone.utc)
            await reviews_col.insert_one({
                "reviewer_id": user_ids[1],
                "reviewed_user_id": user_ids[0],
                "rating": 5,
                "comment": "Super quick response! Met Alice at the campus student union, textbook was in pristine condition as described.",
                "created_at": now
            })
            await reviews_col.insert_one({
                "reviewer_id": user_ids[2],
                "reviewed_user_id": user_ids[0],
                "rating": 5,
                "comment": "Saved me over $60 on my Computer Science algorithms course. Highly recommended seller!",
                "created_at": now
            })
        logger.info("In-memory fallback database pre-seeded successfully.")
    except Exception as err:
        logger.warning(f"Fallback seed notice: {err}")
