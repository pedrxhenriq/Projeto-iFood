from app import db
from app.models.pedido import Pedido
from app.models.pedido_item import PedidoItem
from app.models.products import Product
from app.models.restaurant import Restaurant
from app.models.restaurant_type import RestaurantType
from sqlalchemy import func, and_, or_, case, distinct
from datetime import datetime, timedelta

class AnalyticsService:
    pass