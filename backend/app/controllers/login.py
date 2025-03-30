from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db
from werkzeug.security import check_password_hash

login_bp = Blueprint('login_bp', __name__)

@login_bp.route('/google', methods=['POST'])
def login_google():
    data = request.json
    email = data.get('email')
    nome = data.get('nome')

    if not email or not nome:
        return jsonify({'error': 'Dados incompletos'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'Usuário não cadastrado'}), 401

    return jsonify({
        'message': 'Login bem-sucedido',
        'user': {
            'id': user.id,
            'nome': user.nome,
            'email': user.email
        }
    }), 200

@login_bp.route('/', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')

    if not email or not senha:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.senha:
        return jsonify({'error': 'Usuário não encontrado ou senha não definida'}), 401

    if not check_password_hash(user.senha, senha):
        return jsonify({'error': 'Senha incorreta'}), 401

    return jsonify({
        'message': 'Login bem-sucedido',
        'user': {
            'id': user.id,
            'nome': user.nome,
            'email': user.email
        }
    }), 200