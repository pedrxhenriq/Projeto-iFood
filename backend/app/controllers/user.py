from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.endereco import Endereco
from app import db
from werkzeug.security import generate_password_hash

user_bp = Blueprint('user_bp', __name__)

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
    
    if not data or 'nome' not in data or 'email' not in data or 'senha' not in data:
        return jsonify({'message': 'Dados inválidos'}), 400
    
    nome = data['nome']
    email = data['email']
    senha = data['senha']
    cpf = data.get('cpf')
    telefone = data.get('telefone')

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email já registrado'}), 409

    senha_hash = generate_password_hash(senha)

    new_user = User(
        nome=nome,
        email=email,
        cpf=cpf,
        senha=senha_hash,
        telefone=telefone
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

    novo_email = data.get('email')
    if novo_email and novo_email != user.email:
        if User.query.filter_by(email=novo_email).first():
            return jsonify({'error': 'Email já está em uso por outro usuário'}), 409
        user.email = novo_email

    user.nome = data.get('nome', user.nome)
    user.cpf = data.get('cpf', user.cpf)
    user.telefone = data.get('telefone', user.telefone)

    nova_senha = data.get('senha')
    if nova_senha:
        user.senha = generate_password_hash(nova_senha)

    db.session.commit()
    return jsonify({'message': 'Usuário atualizado com sucesso!'}), 200

@user_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    user.ativo = False
    db.session.commit()
    return jsonify({'message': 'Usuário desativado com sucesso!'}), 200

@user_bp.route('/enderecos/<int:user_id>', methods=['GET'])
def listar_enderecos(user_id):
    apenas_ativos = request.args.get('ativos', default=None)

    query = Endereco.query.filter_by(user_id=user_id)
    if apenas_ativos == '1':
        query = query.filter_by(ativo=True)

    enderecos = query.all()

    lista = [{
        'id': e.id,
        'logradouro': e.logradouro,
        'numero': e.numero,
        'complemento': e.complemento,
        'bairro': e.bairro,
        'cidade': e.cidade,
        'estado': e.estado,
        'cep': e.cep,
        'ativo': e.ativo
    } for e in enderecos]

    return jsonify(lista), 200

@user_bp.route('/enderecos/', methods=['POST'])
def criar_endereco():
    data = request.json
    required_fields = ['user_id', 'logradouro', 'cidade', 'estado', 'cep']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Campos obrigatórios ausentes'}), 400

    novo_endereco = Endereco(
        user_id=data['user_id'],
        logradouro=data['logradouro'],
        numero=data.get('numero'),
        complemento=data.get('complemento'),
        bairro=data.get('bairro'),
        cidade=data['cidade'],
        estado=data['estado'],
        cep=data['cep']
    )
    db.session.add(novo_endereco)
    db.session.commit()

    return jsonify({'message': 'Endereço criado com sucesso'}), 201

@user_bp.route('/enderecos/<int:id>', methods=['POST'])
def reactive_endereco(id):
    endereco = Endereco.query.get_or_404(id)
    endereco.ativo = True
    db.session.commit()
    return jsonify({'message': 'Endereço reativado com sucesso!'}), 200

@user_bp.route('/enderecos/<int:id>', methods=['PATCH'])
def atualizar_endereco(id):
    endereco = Endereco.query.get_or_404(id)
    data = request.json

    endereco.logradouro = data.get('logradouro', endereco.logradouro)
    endereco.numero = data.get('numero', endereco.numero)
    endereco.complemento = data.get('complemento', endereco.complemento)
    endereco.bairro = data.get('bairro', endereco.bairro)
    endereco.cidade = data.get('cidade', endereco.cidade)
    endereco.estado = data.get('estado', endereco.estado)
    endereco.cep = data.get('cep', endereco.cep)

    db.session.commit()
    return jsonify({'message': 'Endereço atualizado com sucesso'}), 200

@user_bp.route('/enderecos/<int:id>', methods=['DELETE'])
def deletar_endereco(id):
    endereco = Endereco.query.get_or_404(id)
    endereco.ativo = False
    db.session.commit()
    return jsonify({'message': 'Endereço desativado com sucesso'}), 200
