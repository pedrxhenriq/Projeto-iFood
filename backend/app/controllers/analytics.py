from flask import Blueprint, jsonify, request
from app import db
from app.services.analytics import AnalyticsService
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

def get_period_params():
    """Extrai parâmetros de período da request"""
    period = request.args.get('period', 'last30days')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    return period, start_date, end_date

@analytics_bp.route('/metrics/summary', methods=['GET'])
def get_metrics_summary():
    """Retorna resumo das métricas principais"""
    try:
        period, start_date, end_date = get_period_params()
        data = AnalyticsService.get_metrics_summary(period, start_date, end_date)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/products/top-selling', methods=['GET'])
def get_top_selling_products():
    """Retorna os produtos mais vendidos"""
    try:
        period, start_date, end_date = get_period_params()
        limit = int(request.args.get('limit', 10))
        data = AnalyticsService.get_top_selling_products(period, start_date, end_date, limit)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/products/sales-evolution', methods=['GET'])
def get_products_sales_evolution():
    """Retorna a evolução de vendas dos produtos"""
    try:
        period, start_date, end_date = get_period_params()
        product_ids = request.args.getlist('product_ids', type=int)
        data = AnalyticsService.get_product_sales_evolution(
            product_ids if product_ids else None, 
            period, start_date, end_date
        )
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/restaurants/top-sales', methods=['GET'])
def get_top_restaurants():
    """Retorna os restaurantes com maior volume de vendas"""
    try:
        period, start_date, end_date = get_period_params()
        limit = int(request.args.get('limit', 10))
        data = AnalyticsService.get_top_restaurants(period, start_date, end_date, limit)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/restaurants/sales-evolution', methods=['GET'])
def get_restaurants_sales_evolution():
    """Retorna a evolução de vendas por restaurante"""
    try:
        period, start_date, end_date = get_period_params()
        restaurant_ids = request.args.getlist('restaurant_ids', type=int)
        data = AnalyticsService.get_restaurant_sales_evolution(
            restaurant_ids if restaurant_ids else None,
            period, start_date, end_date
        )
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/categories/distribution', methods=['GET'])
def get_categories_distribution():
    """Retorna a distribuição de vendas por categoria"""
    try:
        period, start_date, end_date = get_period_params()
        data = AnalyticsService.get_categories_distribution(period, start_date, end_date)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/delivery/performance', methods=['GET'])
def get_delivery_performance():
    """Retorna análise de desempenho de entrega"""
    try:
        period, start_date, end_date = get_period_params()
        limit = int(request.args.get('limit', 10))
        data = AnalyticsService.get_delivery_performance(period, start_date, end_date, limit)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/sales/evolution', methods=['GET'])
def get_sales_evolution():
    """Retorna a evolução de vendas ao longo do tempo"""
    try:
        period, start_date, end_date = get_period_params()
        group_by = request.args.get('group_by', 'day')
        data = AnalyticsService.get_sales_evolution(period, start_date, end_date, group_by)
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/filters/restaurants', methods=['GET'])
def get_restaurants_for_filter():
    """Retorna lista de restaurantes para filtro"""
    try:
        from app.models.restaurant import Restaurant
        restaurants = db.session.query(
            Restaurant.id, Restaurant.name
        ).filter(Restaurant.is_active == True).all()
        
        data = [{'id': r.id, 'name': r.name} for r in restaurants]
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/filters/products', methods=['GET'])
def get_products_for_filter():
    """Retorna lista de produtos para filtro"""
    try:
        from app.models.products import Product
        from app.models.restaurant import Restaurant
        
        products = db.session.query(
            Product.id, Product.name, Restaurant.name.label('restaurant_name')
        ).join(
            Restaurant, Product.restaurant_id == Restaurant.id
        ).filter(
            Product.is_active == True,
            Restaurant.is_active == True
        ).all()
        
        data = [
            {
                'id': p.id, 
                'name': p.name, 
                'restaurant': p.restaurant_name
            } 
            for p in products
        ]
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@analytics_bp.route('/filters/categories', methods=['GET'])
def get_categories_for_filter():
    """Retorna lista de categorias para filtro"""
    try:
        from app.models.restaurant_type import RestaurantType
        
        categories = db.session.query(
            RestaurantType.id, RestaurantType.name
        ).all()
        
        data = [{'id': c.id, 'name': c.name} for c in categories]
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
