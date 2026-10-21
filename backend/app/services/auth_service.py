import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask import request, jsonify, current_app, g
from ..models import User, db

def generate_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "bureau_id": user.bureau_id,
        "name": user.name,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES", timedelta(hours=8)),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")

def decode_token(token: str) -> dict:
    return jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])

def get_current_user():
    return getattr(g, "current_user", None)

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = None
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        elif request.cookies.get("aicte_token"):
            token = request.cookies.get("aicte_token")

        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401

        try:
            payload = decode_token(token)
            user_id = int(payload["sub"])
            user = db.session.get(User, user_id)
            if not user or not user.is_active:
                return jsonify({"error": "User account is inactive or not found"}), 401
            g.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired, please log in again"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid authentication token"}), 401

        return f(*args, **kwargs)
    return decorated

def roles_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = get_current_user()
            if not user:
                return jsonify({"error": "Authentication required"}), 401
            if user.role not in allowed_roles:
                return jsonify({
                    "error": f"Forbidden: role '{user.role}' lacks permission for this action. Allowed: {list(allowed_roles)}"
                }), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
