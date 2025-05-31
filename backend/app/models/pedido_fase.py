from app import db
from app.models.user import User

class PedidoFase(db.Model):
    __tablename__ = 'pedido_fases'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pedido_id = db.Column(db.Integer, db.ForeignKey('pedidos.id', ondelete='CASCADE'), nullable=False)
    fase = db.Column(db.Enum('aguardando_aceite', 'em_preparo', 'em_entrega', 'entregue', 'recusado', name='fase_enum'), nullable=False)
    data_inicio = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    data_fim = db.Column(db.DateTime, nullable=True)
    motivo_recusa = db.Column(db.Text)
    usuario_responsavel_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    pedido = db.relationship('Pedido', back_populates='fases')
    usuario_responsavel = db.relationship('User', foreign_keys=[usuario_responsavel_id])

    def to_dict(self):
        return {
            'id': self.id,
            'pedido_id': self.pedido_id,
            'fase': self.fase,
            'data_inicio': self.data_inicio.isoformat(),
            'data_fim': self.data_fim.isoformat() if self.data_fim else None,
            'motivo_recusa': self.motivo_recusa,
            'responsavel': {
                'id': self.usuario_responsavel.id,
                'nome': self.usuario_responsavel.name
            } if self.usuario_responsavel else None
        }

    def __repr__(self):
        return f"<PedidoFase(id={self.id}, fase='{self.fase}', pedido_id={self.pedido_id})>"
