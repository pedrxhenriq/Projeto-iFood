from app import db
from app.models.pedido import Pedido
from app.models.pedido_item import PedidoItem
from app.models.products import Product
from app.models.restaurant import Restaurant
from app.models.restaurant_type import RestaurantType
from sqlalchemy import func, and_, or_, case, distinct, text
from datetime import datetime, timedelta

class AnalyticsService:
    
    @staticmethod
    def get_date_filter(period, start_date=None, end_date=None):
        """Retorna o filtro de data baseado no período selecionado"""
        today = datetime.now().date()
        
        if period == 'today':
            return today, today
        elif period == 'yesterday':
            yesterday = today - timedelta(days=1)
            return yesterday, yesterday
        elif period == 'last7days':
            return today - timedelta(days=6), today
        elif period == 'last30days':
            return today - timedelta(days=29), today
        elif period == 'thismonth':
            return today.replace(day=1), today
        elif period == 'lastmonth':
            last_month = today.replace(day=1) - timedelta(days=1)
            return last_month.replace(day=1), last_month
        elif period == 'custom' and start_date and end_date:
            return datetime.strptime(start_date, '%Y-%m-%d').date(), datetime.strptime(end_date, '%Y-%m-%d').date()
        else:
            return today - timedelta(days=29), today

    @staticmethod
    def get_metrics_summary(period='last30days', start_date=None, end_date=None):
        """Retorna resumo das métricas principais"""
        start_dt, end_dt = AnalyticsService.get_date_filter(period, start_date, end_date)
        
        pedidos_query = db.session.query(Pedido).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        )
        
        total_orders = pedidos_query.count()
        
        total_revenue = pedidos_query.with_entities(
            func.sum(Pedido.total)
        ).scalar() or 0
        
        avg_delivery_time = pedidos_query.with_entities(
            func.avg(Pedido.tempo_entrega)
        ).scalar() or 0
        
        pedidos_entregues = pedidos_query.filter(Pedido.status_atual == 'entregue').count()
        avg_rating = 4.5 + (pedidos_entregues / max(total_orders, 1)) * 0.4
        
        days_diff = (end_dt - start_dt).days + 1
        prev_start_dt = start_dt - timedelta(days=days_diff)
        prev_end_dt = start_dt - timedelta(days=1)
        
        prev_pedidos_query = db.session.query(Pedido).filter(
            func.date(Pedido.data_pedido).between(prev_start_dt, prev_end_dt)
        )
        
        prev_total_orders = prev_pedidos_query.count()
        prev_total_revenue = prev_pedidos_query.with_entities(
            func.sum(Pedido.total)
        ).scalar() or 0
        prev_avg_delivery_time = prev_pedidos_query.with_entities(
            func.avg(Pedido.tempo_entrega)
        ).scalar() or 0
        
        orders_trend = ((total_orders - prev_total_orders) / max(prev_total_orders, 1)) * 100
        revenue_trend = ((float(total_revenue) - float(prev_total_revenue)) / max(float(prev_total_revenue), 1)) * 100
        delivery_trend = ((avg_delivery_time - prev_avg_delivery_time) / max(prev_avg_delivery_time, 1)) * 100 * -1
        rating_trend = 0.1
        
        def format_revenue(value):
            if float(value) >= 1000000:
                return f"R$ {float(value)/1000000:.2f}M"
            elif float(value) >= 1000:
                return f"R$ {float(value)/1000:.0f}K"
            else:
                return f"R$ {float(value):.0f}"
        
        return {
            'orders': f"{total_orders:,}".replace(',', '.'),
            'revenue': format_revenue(total_revenue),
            'delivery_time': f"{int(avg_delivery_time)} min",
            'rating': f"{avg_rating:.1f}",
            'trends': {
                'orders': f"{orders_trend:+.1f}%",
                'revenue': f"{revenue_trend:+.1f}%",
                'delivery_time': f"{delivery_trend:+.1f}%",
                'rating': f"{rating_trend:+.1f}%"
            }
        }

    @staticmethod
    def get_top_selling_products(period='last30days', start_date=None, end_date=None, limit=10):
        """Retorna os produtos mais vendidos"""
        start_dt, end_dt = AnalyticsService.get_date_filter(period, start_date, end_date)
        
        query = db.session.query(
            Product.name.label('product_name'),
            Restaurant.name.label('restaurant_name'),
            func.sum(PedidoItem.quantidade).label('total_quantity'),
            func.sum(PedidoItem.quantidade * PedidoItem.preco_unitario).label('total_revenue')
        ).join(
            PedidoItem, Product.id == PedidoItem.produto_id
        ).join(
            Pedido, PedidoItem.pedido_id == Pedido.id
        ).join(
            Restaurant, PedidoItem.restaurante_id == Restaurant.id
        ).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        ).group_by(
            Product.id, Product.name, Restaurant.name
        ).order_by(
            func.sum(PedidoItem.quantidade).desc()
        ).limit(limit)
        
        results = query.all()
        
        return [
            {
                'name': result.product_name,
                'restaurant': result.restaurant_name,
                'quantity': int(result.total_quantity),
                'revenue': float(result.total_revenue)
            }
            for result in results
        ]

    @staticmethod
    def get_top_restaurants(period='last30days', start_date=None, end_date=None, limit=10):
        """Retorna os restaurantes com maior volume de vendas"""
        start_dt, end_dt = AnalyticsService.get_date_filter(period, start_date, end_date)
        
        query = db.session.query(
            Restaurant.name.label('restaurant_name'),
            RestaurantType.name.label('category_name'),
            func.count(distinct(Pedido.id)).label('total_orders'),
            func.sum(Pedido.total).label('total_revenue'),
            func.avg(
                case(
                    (Pedido.status_atual == 'entregue', 4.5),
                    else_=4.0
                )
            ).label('avg_rating')
        ).join(
            PedidoItem, Restaurant.id == PedidoItem.restaurante_id
        ).join(
            Pedido, PedidoItem.pedido_id == Pedido.id
        ).join(
            RestaurantType, Restaurant.restaurant_type_id == RestaurantType.id
        ).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        ).group_by(
            Restaurant.id, Restaurant.name, RestaurantType.name
        ).order_by(
            func.sum(Pedido.total).desc()
        ).limit(limit)
        
        results = query.all()
        
        return [
            {
                'name': result.restaurant_name,
                'category': result.category_name,
                'orders': int(result.total_orders),
                'revenue': float(result.total_revenue),
                'avg_rating': round(float(result.avg_rating), 1)
            }
            for result in results
        ]

    @staticmethod
    def get_categories_distribution(period='last30days', start_date=None, end_date=None):
        """Retorna a distribuição de vendas por categoria"""
        start_dt, end_dt = AnalyticsService.get_date_filter(period, start_date, end_date)
        
        total_orders = db.session.query(Pedido).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        ).count()
        
        query = db.session.query(
            RestaurantType.name.label('category_name'),
            func.count(distinct(Pedido.id)).label('order_count'),
            func.sum(Pedido.total).label('total_revenue')
        ).join(
            Restaurant, RestaurantType.id == Restaurant.restaurant_type_id
        ).join(
            PedidoItem, Restaurant.id == PedidoItem.restaurante_id
        ).join(
            Pedido, PedidoItem.pedido_id == Pedido.id
        ).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        ).group_by(
            RestaurantType.id, RestaurantType.name
        ).order_by(
            func.count(distinct(Pedido.id)).desc()
        )
        
        results = query.all()
        
        return [
            {
                'name': result.category_name,
                'percentage': round((result.order_count / max(total_orders, 1)) * 100, 1),
                'orders': int(result.order_count),
                'revenue': float(result.total_revenue)
            }
            for result in results
        ]

    @staticmethod
    def get_delivery_performance(period='last30days', start_date=None, end_date=None, limit=10):
        """Retorna análise de desempenho de entrega por restaurante"""
        start_dt, end_dt = AnalyticsService.get_date_filter(period, start_date, end_date)
        
        query = db.session.query(
            Restaurant.name.label('restaurant_name'),
            func.avg(Pedido.tempo_entrega).label('avg_delivery_time'),
            func.count(distinct(Pedido.id)).label('total_orders'),
            func.sum(
                case(
                    (Pedido.status_atual == 'entregue', 1),
                    else_=0
                )
            ).label('delivered_orders'),
            func.sum(
                case(
                    (Pedido.tempo_entrega <= 30, 1),
                    else_=0
                )
            ).label('on_time_deliveries')
        ).join(
            PedidoItem, Restaurant.id == PedidoItem.restaurante_id
        ).join(
            Pedido, PedidoItem.pedido_id == Pedido.id
        ).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        ).group_by(
            Restaurant.id, Restaurant.name
        ).having(
            func.count(distinct(Pedido.id)) > 0
        ).order_by(
            func.avg(Pedido.tempo_entrega).asc()
        ).limit(limit)
        
        results = query.all()
        
        return [
            {
                'restaurant': result.restaurant_name,
                'avg_delivery_time': round(float(result.avg_delivery_time), 1),
                'total_orders': int(result.total_orders),
                'delivery_rate': round((result.delivered_orders / max(result.total_orders, 1)) * 100, 1),
                'on_time_rate': round((result.on_time_deliveries / max(result.total_orders, 1)) * 100, 1)
            }
            for result in results
        ]

    @staticmethod
    def get_sales_evolution(period='last30days', start_date=None, end_date=None, group_by='day'):
        """Retorna a evolução de vendas ao longo do tempo"""
        start_dt, end_dt = AnalyticsService.get_date_filter(period, start_date, end_date)
        
        if group_by == 'day':
            date_format = func.date(Pedido.data_pedido)
        elif group_by == 'week':
            date_format = func.date_trunc('week', Pedido.data_pedido)
        else:
            date_format = func.date_trunc('month', Pedido.data_pedido)
        
        query = db.session.query(
            date_format.label('date'),
            func.count(Pedido.id).label('orders'),
            func.sum(Pedido.total).label('revenue'),
            func.avg(Pedido.tempo_entrega).label('avg_delivery_time')
        ).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        ).group_by(
            date_format
        ).order_by(
            date_format
        )
        
        results = query.all()
        
        return [
            {
                'date': result.date.strftime('%Y-%m-%d') if hasattr(result.date, 'strftime') else str(result.date),
                'orders': int(result.orders),
                'revenue': float(result.revenue),
                'avg_delivery_time': round(float(result.avg_delivery_time or 0), 1)
            }
            for result in results
        ]

    @staticmethod
    def get_product_sales_evolution(product_ids=None, period='last30days', start_date=None, end_date=None):
        """Retorna a evolução de vendas de produtos específicos"""
        start_dt, end_dt = AnalyticsService.get_date_filter(period, start_date, end_date)
        
        query = db.session.query(
            func.date(Pedido.data_pedido).label('date'),
            Product.name.label('product_name'),
            func.sum(PedidoItem.quantidade).label('quantity')
        ).join(
            PedidoItem, Product.id == PedidoItem.produto_id
        ).join(
            Pedido, PedidoItem.pedido_id == Pedido.id
        ).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        )
        
        if product_ids:
            query = query.filter(Product.id.in_(product_ids))
        
        query = query.group_by(
            func.date(Pedido.data_pedido), Product.id, Product.name
        ).order_by(
            func.date(Pedido.data_pedido), Product.name
        )
        
        results = query.all()
        
        products_data = {}
        for result in results:
            if result.product_name not in products_data:
                products_data[result.product_name] = []
            
            products_data[result.product_name].append({
                'date': result.date.strftime('%Y-%m-%d'),
                'quantity': int(result.quantity)
            })
        
        return products_data

    @staticmethod
    def get_restaurant_sales_evolution(restaurant_ids=None, period='last30days', start_date=None, end_date=None):
        """Retorna a evolução de vendas de restaurantes específicos"""
        start_dt, end_dt = AnalyticsService.get_date_filter(period, start_date, end_date)
        
        query = db.session.query(
            func.date(Pedido.data_pedido).label('date'),
            Restaurant.name.label('restaurant_name'),
            func.count(distinct(Pedido.id)).label('orders'),
            func.sum(Pedido.total).label('revenue')
        ).join(
            PedidoItem, Restaurant.id == PedidoItem.restaurante_id
        ).join(
            Pedido, PedidoItem.pedido_id == Pedido.id
        ).filter(
            func.date(Pedido.data_pedido).between(start_dt, end_dt)
        )
        
        if restaurant_ids:
            query = query.filter(Restaurant.id.in_(restaurant_ids))
        
        query = query.group_by(
            func.date(Pedido.data_pedido), Restaurant.id, Restaurant.name
        ).order_by(
            func.date(Pedido.data_pedido), Restaurant.name
        )
        
        results = query.all()
        
        restaurants_data = {}
        for result in results:
            if result.restaurant_name not in restaurants_data:
                restaurants_data[result.restaurant_name] = []
            
            restaurants_data[result.restaurant_name].append({
                'date': result.date.strftime('%Y-%m-%d'),
                'orders': int(result.orders),
                'revenue': float(result.revenue)
            })
        
        return restaurants_data
