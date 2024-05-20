"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,JWTManager
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os

app = Flask(__name__)
api = Blueprint('api', __name__)
CORS(api)
bcrypt = Bcrypt(app)

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data["email"]
    
    repetido = User.query.filter_by(email=email).first()
    if repetido: 
        return jsonify({"error":"correo registrado"}), 400
    
    password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')

    user = User(email=email,password=password,is_active=True)
    
    db.session.add(user)
    db.session.commit()   

    return jsonify({"mensaje":"registro exitoso"}),201

@api.route("/login", methods=["POST"])
def user_login():
    try:
        data = request.get_json()
        
        
        if not data or "email" not in data or "password" not in data:
            return jsonify({"message": "Se requieren tanto el correo electrónico como la contraseña"}), 400

        email = data["email"]
        password = data["password"]

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        if not bcrypt.check_password_hash(user.password,password):
        
            return jsonify({"message": "Credenciales incorrectas"}), 401

        payload={ "email": user.email, "nivel": "user"}
        token = create_access_token(identity=user.id,additional_claims=payload )
        return jsonify({"token": token}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"message": "Ocurrió un error interno del servidor"}), 500

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({'message': f'Hello, bruno!'})

