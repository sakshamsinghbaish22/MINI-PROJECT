import uvicorn
import os
import sys

if __name__ == "__main__":
    # Ensure current directory is in sys.path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    print("=" * 60)
    print("  Starting BookCycle FastAPI Backend Server")
    print("  Tagline: Give Every Book a Second Life")
    print("  API Docs: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
