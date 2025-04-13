from flask import Blueprint, request, jsonify
from app import db
from app.models.products import Product
from app.models.restaurant import Restaurant

product_bp = Blueprint('product_bp', __name__)

@product_bp.route('/restaurants', methods=['GET'])
def get_restaurants():
    restaurants = Restaurant.query.all()
    result = [{'id': t.id, 'name': t.name} for t in restaurants]
    return jsonify(result), 200

@product_bp.route('/', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = Product.query.paginate(page=page, per_page=per_page, error_out=False)

    products = [
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'preparation_time': p.preparation_time,
            'price': float(p.price),
            'restaurant_id': p.restaurant_id,
            'restaurant_name': p.restaurant.name if p.restaurant else None,
            'image_base64': p.image_base64,
            'is_active': p.is_active
        } for p in pagination.items
    ]

    return jsonify({
        'products': products,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page,
        'per_page': pagination.per_page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev
    }), 200

@product_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)

    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'preparation_time': product.preparation_time,
        'price': float(product.price),
        'restaurant_id': product.restaurant_id,
        'restaurant_name': product.restaurant.name if product.restaurant else None,
        'image_base64': product.image_base64,
        'is_active': product.is_active
    }), 200

@product_bp.route('/', methods=['POST'])
def create_product():
    data = request.get_json()

    required_fields = ['name', 'preparation_time', 'price', 'restaurant_id']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    restaurant = Restaurant.query.get(data['restaurant_id'])
    if not restaurant:
        return jsonify({'error': 'Restaurante não encontrado'}), 404

    product = Product(
        name=data['name'],
        description=data.get('description'),
        preparation_time=data['preparation_time'],
        price=data['price'],
        restaurant_id=data['restaurant_id'],
        image_base64=data.get('image_base64')
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({'message': 'Produto criado com sucesso', 'id': product.id}), 201

@product_bp.route('/<int:id>', methods=['POST'])
def reactive_product(id):
    product = Product.query.get_or_404(id)
    product.is_active = True
    db.session.commit()
    return jsonify({'message': 'Produto reativado com sucesso!'}), 200

@product_bp.route('/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.preparation_time = data.get('preparation_time', product.preparation_time)
    product.price = data.get('price', product.price)
    product.restaurant_id = data.get('restaurant_id', product.restaurant_id)
    product.image_base64 = data.get('image_base64', product.image_base64)

    db.session.commit()
    return jsonify({'message': 'Produto atualizado com sucesso'}), 200

@product_bp.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    if not product.is_active:
        return jsonify({'message': 'Produto já está inativo'}), 400

    product.is_active = False
    db.session.commit()
    return jsonify({'message': 'Produto desativado com sucesso'}), 200
