from flask import Blueprint, request, jsonify
from app.models.restaurant import Restaurant
from app.models.restaurant_type import RestaurantType
from app import db

restaurant_bp = Blueprint('restaurant_bp', __name__)

@restaurant_bp.route('/types', methods=['GET'])
def get_types():
    types = RestaurantType.query.all()
    result = [{'id': t.id, 'name': t.name} for t in types]
    return jsonify(result), 200

@restaurant_bp.route('/', methods=['GET'])
def get_restaurants():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = Restaurant.query.paginate(
        page=page, per_page=per_page, error_out=False
    )

    restaurants = [
        {
            'id': r.id,
            'name': r.name,
            'cnpj': r.cnpj,
            'address': r.address,
            'phone': r.phone,
            'restaurant_type_id': r.restaurant_type_id,
            'restaurant_type': r.restaurant_type.name if r.restaurant_type else None,
            'is_active': r.is_active,
        } for r in pagination.items
    ]

    return jsonify({
        'restaurants': restaurants,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page,
        'per_page': pagination.per_page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev
    }), 200

@restaurant_bp.route('/<int:id>', methods=['GET'])
def get_restaurant(id):
    restaurant = Restaurant.query.get_or_404(id)
    if not restaurant.is_active:
        return jsonify({'message': 'Restaurante inativo'}), 404

    return jsonify({
        'id': restaurant.id,
        'name': restaurant.name,
        'cnpj': restaurant.cnpj,
        'address': restaurant.address,
        'phone': restaurant.phone,
        'restaurant_type_id': restaurant.restaurant_type_id,
        'restaurant_type': restaurant.restaurant_type.name if restaurant.restaurant_type else None
    }), 200

@restaurant_bp.route('/', methods=['POST'])
def create_restaurant():
    data = request.get_json()
    required_fields = ['name', 'cnpj', 'restaurant_type_id']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    new_restaurant = Restaurant(
        name=data['name'],
        cnpj=data['cnpj'],
        address=data.get('address'),
        phone=data.get('phone'),
        restaurant_type_id=data['restaurant_type_id']
    )
    db.session.add(new_restaurant)
    db.session.commit()
    return jsonify({'message': 'Restaurante criado com sucesso', 'id': new_restaurant.id}), 201

@restaurant_bp.route('/<int:id>', methods=['POST'])
def reactive_restaurant(id):
    restaurant = Restaurant.query.get_or_404(id)
    restaurant.is_active = True
    db.session.commit()
    return jsonify({'message': 'Restaurante reativado com sucesso!'}), 200

@restaurant_bp.route('/<int:id>', methods=['PATCH'])
def update_restaurant(id):
    restaurant = Restaurant.query.get_or_404(id)
    data = request.get_json()

    restaurant.name = data.get('name', restaurant.name)
    restaurant.cnpj = data.get('cnpj', restaurant.cnpj)
    restaurant.address = data.get('address', restaurant.address)
    restaurant.phone = data.get('phone', restaurant.phone)
    restaurant.restaurant_type_id = data.get('restaurant_type_id', restaurant.restaurant_type_id)

    db.session.commit()
    return jsonify({'message': 'Restaurante atualizado com sucesso'}), 200

@restaurant_bp.route('/<int:id>', methods=['DELETE'])
def delete_restaurant(id):
    restaurant = Restaurant.query.get_or_404(id)
    if not restaurant.is_active:
        return jsonify({'message': 'Restaurante já está inativo'}), 400

    restaurant.is_active = False
    db.session.commit()
    return jsonify({'message': 'Restaurante desativado com sucesso'}), 200