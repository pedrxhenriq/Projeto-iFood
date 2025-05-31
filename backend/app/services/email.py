from flask_mail import Message
from flask import render_template
from app import mail
from app.models.user import User

def enviar_email_pedido(user_id, pedido_id, itens, total, tipo_entrega, tempo_total, caminho_pdf):
    usuario = User.query.get(user_id)

    if not usuario:
        return

    html_body = render_template("email_pedido.html",
                                nome_usuario=usuario.nome,
                                pedido_id=pedido_id,
                                itens=itens,
                                total=total,
                                tipo_entrega=tipo_entrega,
                                tempo_total=tempo_total)

    msg = Message(subject="Seu pedido foi recebido com sucesso!",
                  sender="nao-responda@startai.com",
                  recipients=[usuario.email])
    msg.html = html_body

    with open(caminho_pdf, 'rb') as f:
        msg.attach(f'pedido_{pedido_id}.pdf', 'application/pdf', f.read())

    mail.send(msg)
