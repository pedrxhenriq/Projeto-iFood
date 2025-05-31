from app import db
from app.models.pagamento_opcoes import PagamentoOpcao
from app.models.endereco import Endereco

class Pedido(db.Model):
    __tablename__ = 'pedidos'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_atual = db.Column(db.Enum('aguardando_aceite', 'em_preparo', 'em_entrega', 'entregue', 'recusado', name='status_enum'), nullable=False, default='aguardando_aceite')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    endereco_id = db.Column(db.Integer, db.ForeignKey('enderecos.id'), nullable=True)
    pagamento_id = db.Column(db.Integer, db.ForeignKey('pagamento_opcoes.id'), nullable=False)
    tipo_entrega = db.Column(db.String(20), nullable=False)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    tempo_preparo = db.Column(db.Integer, nullable=False)
    tempo_entrega = db.Column(db.Integer, nullable=False)
    tempo_total_estimado = db.Column(db.Integer, nullable=False)
    data_pedido = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    itens = db.relationship('PedidoItem', back_populates='pedido', cascade='all, delete-orphan')
    fases = db.relationship('PedidoFase', back_populates='pedido', cascade='all, delete-orphan')
    pagamento = db.relationship('PagamentoOpcao', backref='pedidos')
    endereco = db.relationship('Endereco', backref='pedidos')

    def to_dict(self):
        return {
            'id': self.id,
            'status_atual': self.status_atual,
            'user_id': self.user_id,
            'endereco_id': self.endereco_id,
            'pagamento_id': self.pagamento_id,
            'tipo_entrega': self.tipo_entrega,
            'total': float(self.total),
            'tempo_preparo': self.tempo_preparo,
            'tempo_entrega': self.tempo_entrega,
            'tempo_total_estimado': self.tempo_total_estimado,
            'data_pedido': self.data_pedido.isoformat()
        }

    def __repr__(self):
        return f"<Pedido(id={self.id}, status='{self.status_atual}')>"
