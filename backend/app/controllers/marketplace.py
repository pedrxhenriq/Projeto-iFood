from flask import Blueprint, request, jsonify
from app import db
from app.models.products import Product
from app.models.restaurant import Restaurant
from app.models.restaurant_type import RestaurantType
from app.models.pagamento_opcoes import PagamentoOpcao

marketplace_bp = Blueprint('marketplace_bp', __name__)

@marketplace_bp.route('/types', methods=['GET'])
def get_types():
    types = RestaurantType.query.all()
    result = [{'id': t.id, 'name': t.name} for t in types]
    return jsonify(result), 200

@marketplace_bp.route('/opcoes-pagamento', methods=['GET'])
def get_payment_options():
    types = PagamentoOpcao.query.all()
    result = [{'id': t.id, 'tipo_pagamento': t.tipo_pagamento, 'metodo': t.metodo} for t in types]
    return jsonify(result), 200

@marketplace_bp.route('/restaurants/by-type', methods=['GET'])
def get_restaurants_by_type():
    type_name = request.args.get('type')
    if not type_name:
        return jsonify({'error': 'Tipo não informado'}), 400

    restaurant_type = RestaurantType.query.filter_by(name=type_name).first()
    if not restaurant_type:
        return jsonify([])

    restaurants = Restaurant.query.filter_by(
        restaurant_type_id=restaurant_type.id,
        is_active=True
    ).all()

    return jsonify([r.to_dict() for r in restaurants])

@marketplace_bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '').strip().lower()

    if not query:
        return jsonify({'error': 'Consulta vazia'}), 400

    restaurants = Restaurant.query.filter(
        Restaurant.is_active == True,
        Restaurant.name.ilike(f'%{query}%')
    ).all()

    products = Product.query.filter(
        Product.is_active == True,
        Product.name.ilike(f'%{query}%')
    ).all()

    restaurants_data = []
    for r in restaurants:
        preview_products = Product.query.filter_by(
            restaurant_id=r.id,
            is_active=True
        ).all()

        r_dict = r.to_dict()
        r_dict['preview_products'] = [
            {
                'id': p.id,
                'name': p.name,
                'description': p.description,
                'price': float(p.price),
                'preparation_time': p.preparation_time,
                'image_base64': p.image_base64
            }
            for p in preview_products
        ]
        restaurants_data.append(r_dict)

    return jsonify({
        'restaurants': restaurants_data,
        'products': [p.to_dict() for p in products]
    })
