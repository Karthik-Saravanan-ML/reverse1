from jose import jwt, JWTError
from fastapi import HTTPException, Header
from config import settings

class JWTValidator:
    def __init__(self, secret: str, algorithm: str):
        self.secret = secret
        self.algorithm = algorithm
    
    def validate_token(self, token: str) -> dict:
        """Returns claims dict or raises HTTPException(401)"""
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return payload
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    def validate_service_key(self, key: str) -> bool:
        """Validates internal service-to-service key"""
        return key == settings.INTERNAL_SERVICE_KEY

jwt_validator = JWTValidator(settings.JWT_SECRET, settings.JWT_ALGORITHM)

async def get_current_user(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    return jwt_validator.validate_token(token)

async def require_service_auth(x_service_key: str = Header(...)):
    if not jwt_validator.validate_service_key(x_service_key):
        raise HTTPException(403, "Invalid service key")
