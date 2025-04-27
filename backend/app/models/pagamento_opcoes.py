from app import db

class PagamentoOpcao(db.Model):
    __tablename__ = 'pagamento_opcoes'

    id = db.Column(db.Integer, primary_key=True)
    tipo_pagamento = db.Column(db.String(50), nullable=False)
    metodo = db.Column(db.String(50), nullable=False)
