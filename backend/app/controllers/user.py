from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db

user_bp = Blueprint('user_bp', __name__)

from flask import request, jsonify

@user_bp.route('/', methods=['GET'])
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = User.query.paginate(page=page, per_page=per_page, error_out=False)
    
    users = [
        {
            'id': user.id,
            'nome': user.nome,
            'email': user.email,
            'cpf': user.cpf,
            'telefone': user.telefone,
            'ativo': user.ativo
        } for user in pagination.items
    ]

    return jsonify({
        'users': users,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page,
        'per_page': pagination.per_page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev
    }), 200

@user_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    result = {
        'id': user.id,
        'nome': user.nome,
        'email': user.email,
        'cpf': user.cpf,
        'telefone': user.telefone,
        'ativo': user.ativo
    }
    return jsonify(result), 200

@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or 'nome' not in data or 'email' not in data:
        return jsonify({'message': 'Dados inválidos'}), 400

    new_user = User(
        nome=data['nome'],
        email=data['email'],
        cpf=data.get('cpf'),
        telefone=data.get('telefone')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Usuário criado com sucesso!'}), 201

@user_bp.route('/<int:id>', methods=['POST'])
def reactive_user(id):
    user = User.query.get_or_404(id)
    user.ativo = True
    db.session.commit()
    return jsonify({'message': 'Usuário reativado com sucesso!'}), 200

@user_bp.route('/<int:id>', methods=['PATCH'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    user.nome = data.get('nome', user.nome)
    user.email = data.get('email', user.email)
    user.cpf = data.get('cpf', user.cpf)
    user.telefone = data.get('telefone', user.telefone)

    db.session.commit()
    return jsonify({'message': 'Usuário atualizado com sucesso!'}), 200

@user_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    user.ativo = False
    db.session.commit()
    return jsonify({'message': 'Usuário desativado com sucesso!'}), 200
