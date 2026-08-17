from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import (
    auth,
    users,
    books,
    wishlist,
    messages,
    transactions,
    reviews,
    reports,
    admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    yield
    # Shutdown: Close MongoDB connection
    await close_mongo_connection()

app = FastAPI(
    title="BookCycle API",
    description="Student-focused second-hand book buying, selling, donating, and exchanging platform.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(books.router)
app.include_router(wishlist.router)
app.include_router(messages.router)
app.include_router(transactions.router)
app.include_router(reviews.router)
app.include_router(reports.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to BookCycle API",
        "tagline": "Give Every Book a Second Life",
        "docs_url": "/docs",
        "status": "online"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "bookcycle-backend"}
