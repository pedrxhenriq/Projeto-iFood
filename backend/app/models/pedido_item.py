from app import db

class PedidoItem(db.Model):
    __tablename__ = 'pedido_itens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedidos.id', ondelete='CASCADE'), nullable=False)
    produto_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    restaurante_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    preco_unitario = db.Column(db.Numeric(10, 2), nullable=False)

    pedido = db.relationship('Pedido', back_populates='itens')
    produto = db.relationship('Product')
    restaurante = db.relationship('Restaurant')

    def to_dict(self):
        return {
            'id': self.id,
            'pedido_id': self.pedido_id,
            'produto_id': self.produto_id,
            'restaurante_id': self.restaurante_id,
            'quantidade': self.quantidade,
            'preco_unitario': float(self.preco_unitario)
        }

    def __repr__(self):
        return f"<PedidoItem(id={self.id}, pedido_id={self.pedido_id}, produto_id={self.produto_id})>"
