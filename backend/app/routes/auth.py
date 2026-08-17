from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_collection, format_doc
from app.models.user import UserCreate, UserLogin, UserResponse, Token
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    users_col = get_collection("users")
    
    # Check if user already exists
    existing = await users_col.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )
    
    now = datetime.now(timezone.utc)
    new_user_doc = {
        "name": user_in.name.strip(),
        "email": user_in.email.lower().strip(),
        "password_hash": hash_password(user_in.password),
        "college": user_in.college.strip(),
        "location": user_in.location.strip(),
        "profile_image": user_in.profile_image or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "role": "USER",
        "rating": 5.0,
        "review_count": 0,
        "is_active": True,
        "created_at": now
    }
    
    res = await users_col.insert_one(new_user_doc)
    created_user = await users_col.find_one({"_id": res.inserted_id})
    user_dict = format_doc(created_user)
    
    access_token = create_access_token(data={"sub": user_dict["id"], "role": user_dict["role"]})
    return Token(access_token=access_token, user=UserResponse(**user_dict))

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    users_col = get_collection("users")
    user = await users_col.find_one({"email": credentials.email.lower().strip()})
    
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended. Please contact platform administrators."
        )
    
    user_dict = format_doc(user)
    access_token = create_access_token(data={"sub": user_dict["id"], "role": user_dict.get("role", "USER")})
    return Token(access_token=access_token, user=UserResponse(**user_dict))

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)
