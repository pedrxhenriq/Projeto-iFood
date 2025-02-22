from app import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.BigInteger)
    telefone = db.Column(db.BigInteger)
    ativo = db.Column(db.Boolean, default=True, nullable=False)

    def __repr__(self):
        return f"<User {self.nome} - {self.email}>"
