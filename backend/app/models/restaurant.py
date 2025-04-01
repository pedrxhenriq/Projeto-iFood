from app import db
from app.models.restaurant_type import RestaurantType
from app.models.products import Product

class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    cnpj = db.Column(db.String(18), nullable=False, unique=True)
    address = db.Column(db.String(200))
    phone = db.Column(db.String(50))
    restaurant_type_id = db.Column(db.Integer, db.ForeignKey('restaurant_types.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    restaurant_type = db.relationship('RestaurantType', back_populates='restaurants')
    products = db.relationship('Product', back_populates='restaurant', cascade='all, delete-orphan')


    def __repr__(self):
        return f"<Restaurant(id={self.id}, name='{self.name}', type_id={self.restaurant_type_id})>"
