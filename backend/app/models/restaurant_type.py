from app import db

class RestaurantType(db.Model):
    __tablename__ = 'restaurant_types'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

    restaurants = db.relationship('Restaurant', back_populates='restaurant_type')

    def __repr__(self):
        return f"<RestaurantType(id={self.id}, name='{self.name}')>"
