from app import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    preparation_time = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image_base64 = db.Column(db.Text)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    restaurant = db.relationship('Restaurant', back_populates='products')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'preparation_time': self.preparation_time,
            'price': float(self.price),
            'image_base64': self.image_base64,
            'restaurant_id': self.restaurant_id,
            'restaurant_name': self.restaurant.name if self.restaurant else None,
            'restaurant_image_base64': self.restaurant.image_base64 if self.restaurant else None
        }

    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', restaurant_id={self.restaurant_id})>"
