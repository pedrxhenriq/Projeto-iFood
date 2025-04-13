from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object('config.Config')
    
    db.init_app(app)
    
    from app.controllers.user import user_bp
    app.register_blueprint(user_bp, url_prefix='/users')

    from app.controllers.login import login_bp
    app.register_blueprint(login_bp, url_prefix='/login')

    from app.controllers.restaurant import restaurant_bp
    app.register_blueprint(restaurant_bp, url_prefix='/restaurants')

    from app.controllers.product import product_bp
    app.register_blueprint(product_bp, url_prefix='/products')

    from app.controllers.marketplace import marketplace_bp
    app.register_blueprint(marketplace_bp, url_prefix='/marketplace')
    
    return app
