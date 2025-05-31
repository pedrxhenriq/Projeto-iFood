from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS

db = SQLAlchemy()
mail = Mail()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object('config.Config')
    
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'phmsilva0402@gmail.com'
    app.config['MAIL_PASSWORD'] = 'gipu dtbt kdff ehtd'
    app.config['MAIL_DEFAULT_SENDER'] = ('Projeto iFood', 'phmsilva0402@gmail.com')

    db.init_app(app)
    mail.init_app(app)
    
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

    from app.controllers.pedido import pedido_bp
    app.register_blueprint(pedido_bp, url_prefix='/pedido')

    from app.controllers.analytics import analytics_bp
    app.register_blueprint(analytics_bp, url_prefix='/analytics')
    
    return app
