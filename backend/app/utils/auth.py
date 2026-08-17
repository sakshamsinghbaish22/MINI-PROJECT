import os
import hashlib
import binascii
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import json
import base64
import hmac

try:
    from jose import JWTError, jwt
except ImportError:
    class JWTError(Exception):
        pass

    class SimpleJWT:
        @staticmethod
        def encode(claims: dict, secret: str, algorithm: str = "HS256") -> str:
            header = {"alg": algorithm, "typ": "JWT"}
            h_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
            
            # Serialize datetimes
            serializable_claims = {}
            for k, v in claims.items():
                if isinstance(v, datetime):
                    serializable_claims[k] = int(v.timestamp())
                else:
                    serializable_claims[k] = v
            p_b64 = base64.urlsafe_b64encode(json.dumps(serializable_claims).encode()).decode().rstrip("=")
            signing_input = f"{h_b64}.{p_b64}".encode()
            sig = hmac.new(secret.encode(), signing_input, hashlib.sha256).digest()
            sig_b64 = base64.urlsafe_b64encode(sig).decode().rstrip("=")
            return f"{h_b64}.{p_b64}.{sig_b64}"

        @staticmethod
        def decode(token: str, secret: str, algorithms: list = None) -> dict:
            try:
                parts = token.split(".")
                if len(parts) != 3:
                    raise JWTError("Invalid token format")
                h_b64, p_b64, sig_b64 = parts
                # Verify signature
                signing_input = f"{h_b64}.{p_b64}".encode()
                expected_sig = hmac.new(secret.encode(), signing_input, hashlib.sha256).digest()
                expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode().rstrip("=")
                if not hmac.compare_digest(sig_b64, expected_sig_b64):
                    raise JWTError("Invalid signature")
                # Add padding back
                p_padded = p_b64 + "=" * (-len(p_b64) % 4)
                payload_json = base64.urlsafe_b64decode(p_padded.encode()).decode()
                payload = json.loads(payload_json)
                if "exp" in payload and payload["exp"] < datetime.now(timezone.utc).timestamp():
                    raise JWTError("Token expired")
                return payload
            except Exception as e:
                raise JWTError(str(e))
    jwt = SimpleJWT()

try:
    import bcrypt
    def hash_password(password: str) -> str:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        if hashed_password.startswith("pbkdf2$"):
            parts = hashed_password.split("$")
            salt = binascii.unhexlify(parts[1])
            expected_hash = parts[2]
            pwd_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
            return binascii.hexlify(pwd_hash).decode('ascii') == expected_hash
        try:
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        except Exception:
            return False
except Exception:
    def hash_password(password: str) -> str:
        salt = os.urandom(16)
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return "pbkdf2$" + binascii.hexlify(salt).decode('ascii') + "$" + binascii.hexlify(pwd_hash).decode('ascii')

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        if hashed_password.startswith("pbkdf2$"):
            parts = hashed_password.split("$")
            salt = binascii.unhexlify(parts[1])
            expected_hash = parts[2]
            pwd_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
            return binascii.hexlify(pwd_hash).decode('ascii') == expected_hash
        return False

from app.config import settings
from app.database import get_collection, parse_object_id, format_doc
from app.models.user import UserResponse

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    users_col = get_collection("users")
    obj_id = parse_object_id(user_id)
    if not obj_id:
        raise credentials_exception

    user = await users_col.find_one({"_id": obj_id})
    if user is None:
        raise credentials_exception
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended. Please contact campus admin."
        )

    return format_doc(user)

async def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[dict]:
    if not token:
        return None
    try:
        return await get_current_user(token)
    except Exception:
        return None

async def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
