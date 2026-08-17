from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_collection, parse_object_id, format_doc
from app.models.user import UserUpdate, UserResponse, SellerPublicResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/profile", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

@router.put("/profile", response_model=UserResponse)
async def update_my_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    users_col = get_collection("users")
    obj_id = parse_object_id(current_user["id"])
    
    update_data = {k: v for k, v in user_update.model_dump(exclude_unset=True).items() if v is not None}
    
    if update_data:
        await users_col.update_one({"_id": obj_id}, {"$set": update_data})
        
    updated_user = await users_col.find_one({"_id": obj_id})
    return UserResponse(**format_doc(updated_user))

@router.get("/{user_id}/public", response_model=SellerPublicResponse)
async def get_seller_public_profile(user_id: str):
    users_col = get_collection("users")
    books_col = get_collection("books")
    transactions_col = get_collection("transactions")

    obj_id = parse_object_id(user_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seller not found")
        
    user = await users_col.find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seller not found")

    user_dict = format_doc(user)
    
    # Count books listed and sold
    listed_count = await books_col.count_documents({"owner_id": user_id})
    sold_count = await transactions_col.count_documents({"seller_id": user_id, "status": "COMPLETED"})

    user_dict["books_listed_count"] = listed_count
    user_dict["books_sold_count"] = sold_count

    return SellerPublicResponse(**user_dict)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str):
    users_col = get_collection("users")
    obj_id = parse_object_id(user_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    user = await users_col.find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    return UserResponse(**format_doc(user))

