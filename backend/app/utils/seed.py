import asyncio
from datetime import datetime, timezone
import logging
from app.database import connect_to_mongo, close_mongo_connection, get_database
from app.utils.auth import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bookcycle.seed")

DEMO_USERS = [
    {
        "name": "Alice Johnson",
        "email": "alice@college.edu",
        "password_hash": hash_password("password123"),
        "college": "MIT - Computer Science Dept",
        "location": "Cambridge, MA",
        "profile_image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        "role": "USER",
        "rating": 4.9,
        "review_count": 14,
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "name": "Bob Smith",
        "email": "bob@college.edu",
        "password_hash": hash_password("password123"),
        "college": "Stanford Engineering",
        "location": "Palo Alto, CA",
        "profile_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        "role": "USER",
        "rating": 4.8,
        "review_count": 9,
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "name": "Charlie Davis",
        "email": "charlie@college.edu",
        "password_hash": hash_password("password123"),
        "college": "UC Berkeley - Sciences",
        "location": "Berkeley, CA",
        "profile_image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
        "role": "USER",
        "rating": 5.0,
        "review_count": 6,
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "name": "Campus Moderator Admin",
        "email": "admin@bookcycle.edu",
        "password_hash": hash_password("admin123"),
        "college": "University Administration Office",
        "location": "Main Campus Admin Building",
        "profile_image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        "role": "ADMIN",
        "rating": 5.0,
        "review_count": 28,
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    }
]

def get_demo_books(user_a_id, user_b_id, user_c_id):
    now = datetime.now(timezone.utc)
    return [
        {
            "title": "Introduction to Algorithms (CLRS)",
            "author": "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
            "description": "Essential MIT textbook for computer science students. Covers divide-and-conquer, dynamic programming, graph algorithms, and data structures. Highlighted sparingly in pen.",
            "subject": "Data Structures & Algorithms",
            "course": "CS 201 / Algorithms",
            "category": "Computer Science",
            "edition": "3rd Edition",
            "condition": "Good",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_a_id,
            "location": "North Campus Library / Student Union",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Python Crash Course: A Hands-On, Project-Based Introduction",
            "author": "Eric Matthes",
            "description": "Best introductory guide to Python programming. Includes game development with Pygame, data visualizations with Matplotlib, and Django web apps. Like new condition!",
            "subject": "Programming & Software Engineering",
            "course": "CS 101",
            "category": "Computer Science",
            "edition": "2nd Edition",
            "condition": "Like New",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_b_id,
            "location": "West Engineering Hall Lobby",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Operating System Concepts (The Dinosaur Book)",
            "author": "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
            "description": "Comprehensive textbook covering processes, threads, CPU scheduling, synchronization, deadlocks, and virtual memory architecture. Want to exchange for Computer Networks (Tanenbaum).",
            "subject": "Operating Systems",
            "course": "CS 304",
            "category": "Computer Science",
            "edition": "10th Edition",
            "condition": "Good",
            "price": 0.0,
            "mode": "EXCHANGE",
            "exchange_preference": "Looking for Tanenbaum Computer Networks or Database System Concepts.",
            "images": ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_a_id,
            "location": "Science Quad Lounge",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Database System Concepts",
            "author": "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
            "description": "Covers relational model, SQL queries, transaction management, indexing, and NoSQL storage. Clean pages with no markings.",
            "subject": "DBMS",
            "course": "CS 350",
            "category": "Computer Science",
            "edition": "7th Edition",
            "condition": "Like New",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_c_id,
            "location": "Central Campus Bookstore Cafeteria",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Computer Networking: A Top-Down Approach",
            "author": "James F. Kurose, Keith W. Ross",
            "description": "Focuses on internet architecture and application layer down to link layer. Includes Wireshark lab exercises. Willing to donate to any student taking Networks this term.",
            "subject": "Computer Networks",
            "course": "CS 420",
            "category": "Computer Science",
            "edition": "8th Edition",
            "condition": "Good",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_b_id,
            "location": "Engineering Quad Bldg 3",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Pattern Recognition and Machine Learning",
            "author": "Christopher M. Bishop",
            "description": "Classic gold standard for Bayesian machine learning, neural networks, graphical models, and kernel methods. Pristine hardback copy.",
            "subject": "Machine Learning & AI",
            "course": "CS 480 / AI 501",
            "category": "Artificial Intelligence",
            "edition": "1st Edition Hardcover",
            "condition": "Brand New",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_a_id,
            "location": "Robotics Lab Wing",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Advanced Engineering Mathematics",
            "author": "Erwin Kreyszig",
            "description": "Thorough coverage of ODEs, linear algebra, vector calculus, Fourier analysis, and complex variables. Includes solution notes handwritten for problem sets.",
            "subject": "Engineering Mathematics",
            "course": "MATH 250",
            "category": "Mathematics",
            "edition": "10th Edition",
            "condition": "Good",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_b_id,
            "location": "Math Dept Study Commons",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Fundamentals of Physics (Extended)",
            "author": "David Halliday, Robert Resnick, Jearl Walker",
            "description": "Halliday & Resnick mechanics, thermodynamics, electromagnetism, and optics. Want to exchange for organic chemistry textbook or MCAT/NEET prep series.",
            "subject": "General Physics",
            "course": "PHYS 101/102",
            "category": "Physics",
            "edition": "11th Edition",
            "condition": "Good",
            "price": 0.0,
            "mode": "EXCHANGE",
            "exchange_preference": "Trade for Morrison & Boyd Organic Chemistry or NCERT Physics set.",
            "images": ["https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_c_id,
            "location": "Physics Tower Room 204",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Organic Chemistry",
            "author": "Paula Yurkanis Bruice",
            "description": "Clear stereochemistry, reaction mechanisms, synthesis pathways, and spectroscopy chapters. Free for pre-med or chemistry majors in need.",
            "subject": "Organic Chemistry",
            "course": "CHEM 220",
            "category": "Chemistry",
            "edition": "8th Edition",
            "condition": "Fair",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_a_id,
            "location": "Chemistry Hall Student Lounge",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Concepts of Physics (Vol 1 & Vol 2 Complete Set)",
            "author": "Dr. H.C. Verma",
            "description": "The quintessential physics foundation for competitive engineering exams (JEE Main & Advanced). Complete conceptual questions, worked examples, and exercises.",
            "subject": "Competitive Exam Physics",
            "course": "JEE / Foundation",
            "category": "Competitive Exam Prep",
            "edition": "Latest Revised Edition",
            "condition": "Like New",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_b_id,
            "location": "Student Resource Center",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "NEET Champion Biology (NCERT Extract & MCQs)",
            "author": "MTG Editorial Board",
            "description": "Contains chapter-wise NCERT line-by-line question bank with 100% detailed solutions and 10 years previous NEET solved papers. Free donation to aspiring medical students!",
            "subject": "Medical Biology / NEET Prep",
            "course": "NEET / Pre-Med",
            "category": "Medical & Pre-Med",
            "edition": "2024 Edition",
            "condition": "Brand New",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_c_id,
            "location": "Bio Sciences Atrium",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Problems in General Physics",
            "author": "I.E. Irodov",
            "description": "High-level physics problems for JEE Advanced, Physics Olympiads, and university honors courses. Want to exchange for SL Loney Plane Trigonometry or Coordinate Geometry.",
            "subject": "Advanced Physics Problems",
            "course": "Olympiad / JEE Advanced",
            "category": "Competitive Exam Prep",
            "edition": "Classic Reprint",
            "condition": "Good",
            "price": 0.0,
            "mode": "EXCHANGE",
            "exchange_preference": "Trade for S.L. Loney Trigonometry or Hall & Knight Higher Algebra.",
            "images": ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_a_id,
            "location": "North Campus Engineering Building",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
            "author": "Robert C. Martin (Uncle Bob)",
            "description": "Must-read software development principles, meaningful names, clean functions, error handling, unit testing, and refactoring techniques. Every junior developer should read this.",
            "subject": "Software Engineering Best Practices",
            "course": "CS 310 / Software Craftsmanship",
            "category": "Computer Science",
            "edition": "1st Edition",
            "condition": "Like New",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_b_id,
            "location": "Innovation Hub Coworking Space",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Principles of Neural Science",
            "author": "Eric R. Kandel, James H. Schwartz, Thomas M. Jessell",
            "description": "The definitive neurobiology textbook for medical students, cognitive science majors, and neural computation researchers. Hardcover 5th edition.",
            "subject": "Neuroscience & Medicine",
            "course": "NEURO 301 / MED 102",
            "category": "Medical & Pre-Med",
            "edition": "5th Edition",
            "condition": "Good",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_c_id,
            "location": "Medical Center Quad",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Macroeconomics",
            "author": "N. Gregory Mankiw",
            "description": "Clear explanation of GDP, monetary policy, inflation, exchange rates, and aggregate demand. Donating to any economics or business student.",
            "subject": "Economics",
            "course": "ECON 102",
            "category": "Business & Economics",
            "edition": "9th Edition",
            "condition": "Good",
            "price": 0.0,
            "mode": "DONATE",
            "exchange_preference": None,
            "images": ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_a_id,
            "location": "School of Management Lawn",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        },
        {
            "title": "Designing Data-Intensive Applications",
            "author": "Martin Kleppmann",
            "description": "The big ideas behind reliable, scalable, and maintainable systems: replication, partitioning, transactions, batch and stream processing. Exchange for System Design books.",
            "subject": "Distributed Systems",
            "course": "CS 455 / Cloud Architecture",
            "category": "Computer Science",
            "edition": "1st Edition",
            "condition": "Brand New",
            "price": 0.0,
            "mode": "EXCHANGE",
            "exchange_preference": "Trade for Alex Xu System Design Interview Vol 1 & 2.",
            "images": ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"],
            "owner_id": user_b_id,
            "location": "Hackerspace / CS Lab 4",
            "status": "AVAILABLE",
            "created_at": now,
            "updated_at": now
        }
    ]

async def seed_database():
    await connect_to_mongo()
    db = get_database()
    if db is None:
        logger.error("Could not connect to database for seeding.")
        return

    logger.info("Checking database collections...")
    user_count = await db.users.count_documents({})
    if user_count > 0:
        logger.info(f"Database already contains {user_count} users. Clearing old demo data for fresh setup...")
        await db.users.delete_many({})
        await db.books.delete_many({})
        await db.wishlist.delete_many({})
        await db.messages.delete_many({})
        await db.transactions.delete_many({})
        await db.reviews.delete_many({})
        await db.reports.delete_many({})

    logger.info("Inserting demo users...")
    user_insert_res = await db.users.insert_many(DEMO_USERS)
    user_ids = [str(uid) for uid in user_insert_res.inserted_ids]
    user_a_id, user_b_id, user_c_id, admin_id = user_ids[0], user_ids[1], user_ids[2], user_ids[3]

    logger.info(f"Created demo users: Alice ({user_a_id}), Bob ({user_b_id}), Charlie ({user_c_id}), Admin ({admin_id})")

    demo_books = get_demo_books(user_a_id, user_b_id, user_c_id)
    book_insert_res = await db.books.insert_many(demo_books)
    book_ids = [str(bid) for bid in book_insert_res.inserted_ids]
    logger.info(f"Inserted {len(book_ids)} rich demo books.")

    # Create sample wishlist
    now = datetime.now(timezone.utc)
    sample_wishlist = [
        {"user_id": user_b_id, "book_id": book_ids[0], "created_at": now}, # Bob likes CLRS
        {"user_id": user_c_id, "book_id": book_ids[5], "created_at": now}, # Charlie likes PRML
        {"user_id": user_a_id, "book_id": book_ids[1], "created_at": now}  # Alice likes Python Crash Course
    ]
    await db.wishlist.insert_many(sample_wishlist)

    # Create sample messages
    sample_messages = [
        {
            "sender_id": user_b_id,
            "receiver_id": user_a_id,
            "book_id": book_ids[0],
            "message": "Hi Alice! Is CLRS 3rd edition still available? Can we meet near North Campus Library tomorrow around 2 PM?",
            "read": True,
            "created_at": now
        },
        {
            "sender_id": user_a_id,
            "receiver_id": user_b_id,
            "book_id": book_ids[0],
            "message": "Hey Bob! Yes, it is still available! 2 PM at North Campus Library works great for me. See you there!",
            "read": True,
            "created_at": now
        }
    ]
    await db.messages.insert_many(sample_messages)

    # Create sample transaction
    sample_tx = {
        "book_id": book_ids[0],
        "buyer_id": user_b_id,
        "seller_id": user_a_id,
        "type": "BUY",
        "status": "COMPLETED",
        "message": "Looking forward to buying this for my algorithms midterms!",
        "created_at": now,
        "updated_at": now
    }
    tx_res = await db.transactions.insert_one(sample_tx)
    tx_id = str(tx_res.inserted_id)

    # Create sample review for Alice
    sample_review = {
        "reviewer_id": user_b_id,
        "reviewed_user_id": user_a_id,
        "book_id": book_ids[0],
        "transaction_id": tx_id,
        "rating": 5,
        "comment": "Book was in fantastic condition, exactly as described! Alice was super responsive and easy to meet up with on campus.",
        "created_at": now
    }
    await db.reviews.insert_one(sample_review)

    # Create sample report for demonstration
    sample_report = {
        "reporter_id": user_c_id,
        "reported_user_id": user_b_id,
        "reported_book_id": book_ids[1],
        "reason": "Wrong information",
        "description": "Just checking if the edition listed is 2nd edition or 3rd edition for class syllabus.",
        "status": "PENDING",
        "admin_notes": None,
        "created_at": now
    }
    await db.reports.insert_one(sample_report)

    logger.info("Database seeding completed successfully!")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed_database())
