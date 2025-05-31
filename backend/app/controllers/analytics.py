from flask import Blueprint, jsonify, request
from app.services.analytics import AnalyticsService
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@analytics_bp.route('/products/top-selling', methods=['GET'])
def get_top_selling_products():
    """Retorna os produtos mais vendidos por restaurante"""
    pass

@analytics_bp.route('/products/sales-evolution', methods=['GET'])
def get_products_sales_evolution():
    """Retorna a evolução de vendas dos produtos"""
    pass

@analytics_bp.route('/restaurants/top-sales', methods=['GET'])
def get_top_restaurants():
    """Retorna os restaurantes com maior volume de vendas"""
    pass

@analytics_bp.route('/restaurants/sales-evolution', methods=['GET'])
def get_restaurants_sales_evolution():
    """Retorna a evolução de vendas por restaurante"""
    pass

@analytics_bp.route('/categories/distribution', methods=['GET'])
def get_categories_distribution():
    """Retorna a distribuição de vendas por categoria"""
    pass

@analytics_bp.route('/delivery/average-time', methods=['GET'])
def get_delivery_average_time():
    """Retorna o tempo médio de entrega por restaurante"""
    pass

@analytics_bp.route('/delivery/time-evolution', methods=['GET'])
def get_delivery_time_evolution():
    """Retorna a evolução do tempo médio de entrega"""
    pass

@analytics_bp.route('/delivery/performance', methods=['GET'])
def get_delivery_performance():
    """Retorna análise de desempenho de entrega"""
    pass
