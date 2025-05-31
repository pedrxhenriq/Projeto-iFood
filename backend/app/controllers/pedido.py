from flask import Blueprint, request, jsonify
from app import db
from app.models.pedido import Pedido
from app.models.pedido_item import PedidoItem
from app.models.pedido_fase import PedidoFase
from app.services.email import enviar_email_pedido
from app.utils.pdf_generator import gerar_pdf_pedido

pedido_bp = Blueprint('pedido_bp', __name__)

@pedido_bp.route('/', methods=['POST'])
def criar_pedido():
    data = request.get_json()

    try:
        user_id = data.get('user_id')
        tipo_entrega = data.get('tipoEntrega')
        pagamento_id = data.get('formaPagamento', {}).get('id')
        itens = data.get('itens', [])
        total = float(data.get('total', 0))
        tempo_preparo = int(data.get('tempoPreparo').split()[0])
        tempo_entrega = int(data.get('tempoEntrega').split()[0]) if data.get('tempoEntrega').split()[0].isdigit() else 0
        tempo_total = int(data.get('tempoTotalEstimado').split()[0])

        if tipo_entrega == 'entregar':
            endereco_id = data.get('endereco', {}).get('id')
        else:
            endereco_id = None

        novo_pedido = Pedido(
            status_atual='aguardando_aceite',
            user_id=user_id,
            endereco_id=endereco_id,
            pagamento_id=pagamento_id,
            tipo_entrega=tipo_entrega,
            total=total,
            tempo_preparo=tempo_preparo,
            tempo_entrega=tempo_entrega,
            tempo_total_estimado=tempo_total
        )
        db.session.add(novo_pedido)
        db.session.flush()

        for item in itens:
            pedido_item = PedidoItem(
                pedido_id=novo_pedido.id,
                produto_id=item['id'],
                restaurante_id=item['restaurant_id'],
                quantidade=item['quantity'],
                preco_unitario=item['price']
            )
            db.session.add(pedido_item)

        fase_inicial = PedidoFase(
            pedido_id=novo_pedido.id,
            fase='aguardando_aceite'
        )
        db.session.add(fase_inicial)

        db.session.commit()

        caminho_pdf = gerar_pdf_pedido(novo_pedido.id, itens, total)
        enviar_email_pedido(user_id, novo_pedido.id, itens, total, tipo_entrega, tempo_total, caminho_pdf)

        return jsonify({'message': 'Pedido criado com sucesso', 'pedido_id': novo_pedido.id or None}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@pedido_bp.route('/usuario/<int:user_id>', methods=['GET'])
def listar_resumo_pedidos(user_id):
    pedidos = Pedido.query.filter_by(user_id=user_id).order_by(Pedido.data_pedido.desc()).all()
    
    resumos = []
    for p in pedidos:
        nome_restaurante = None
        if p.itens and p.itens[0].restaurante:
            nome_restaurante = p.itens[0].restaurante.name

        resumos.append({
            'id': p.id,
            'status': p.status_atual,
            'total': float(p.total),
            'data_pedido': p.data_pedido.isoformat(),
            'tempo_estimado': p.tempo_total_estimado,
            'restaurante': nome_restaurante
        })

    return jsonify(resumos)

@pedido_bp.route('/restaurante/<int:restaurante_id>', methods=['GET'])
def listar_pedidos_por_restaurante(restaurante_id):
    pedidos = Pedido.query.order_by(Pedido.data_pedido.desc()).all()

    resumos = []
    for p in pedidos:
        itens_do_restaurante = [item for item in p.itens if item.restaurante_id == restaurante_id]

        if itens_do_restaurante:
            resumos.append({
                'id': p.id,
                'status': p.status_atual,
                'total': float(p.total),
                'data_pedido': p.data_pedido.isoformat(),
                'tempo_estimado': p.tempo_total_estimado,
                'restaurante': itens_do_restaurante[0].restaurante.name if itens_do_restaurante[0].restaurante else None
            })

    return jsonify(resumos)

@pedido_bp.route('/<int:pedido_id>', methods=['GET'])
def detalhes_pedido(pedido_id):
    pedido = Pedido.query.get(pedido_id)
    if not pedido:
        return jsonify({'error': 'Pedido não encontrado'}), 404

    itens_detalhados = []
    for item in pedido.itens:
        restaurante = item.restaurante
        produto = item.produto
        itens_detalhados.append({
            'produto_id': item.produto_id,
            'produto_nome': produto.name if produto else None,
            'descricao': produto.description if produto else None,
            'imagem': produto.image_base64 if produto else None,
            'quantidade': item.quantidade,
            'preco_unitario': float(item.preco_unitario),
            'subtotal': float(item.quantidade * item.preco_unitario),
            'restaurante_id': item.restaurante_id,
            'restaurante_nome': restaurante.name if restaurante else None
        })

    fases = [{
        'fase': f.fase,
        'data_inicio': f.data_inicio.isoformat(),
        'data_fim': f.data_fim.isoformat() if f.data_fim else None,
        'motivo_recusa': f.motivo_recusa,
        'responsavel': {
            'id': f.usuario_responsavel_id,
            'nome': f.usuario_responsavel.nome if f.usuario_responsavel else None
        } if f.usuario_responsavel_id else None
    } for f in pedido.fases]

    pagamento = pedido.pagamento
    pagamento_info = {
        'id': pagamento.id,
        'metodo': pagamento.metodo,
        'tipo_pagamento': pagamento.tipo_pagamento
    } if pagamento else None

    endereco = pedido.endereco
    endereco_info = {
        'id': endereco.id,
        'logradouro': endereco.logradouro,
        'numero': endereco.numero,
        'bairro': endereco.bairro,
        'cidade': endereco.cidade,
        'estado': endereco.estado,
        'cep': endereco.cep,
        'complemento': endereco.complemento
    } if endereco else None

    detalhes = {
        'id': pedido.id,
        'status_atual': pedido.status_atual,
        'tipo_entrega': pedido.tipo_entrega,
        'total': float(pedido.total),
        'tempo_preparo': pedido.tempo_preparo,
        'tempo_entrega': pedido.tempo_entrega,
        'tempo_total_estimado': pedido.tempo_total_estimado,
        'data_pedido': pedido.data_pedido.isoformat(),
        'user_id': pedido.user_id,
        'endereco': endereco_info,
        'pagamento': pagamento_info,
        'itens': itens_detalhados,
        'fases': fases
    }

    return jsonify(detalhes)

@pedido_bp.route('/<int:pedido_id>/avancar', methods=['POST'])
def avancar_status_pedido(pedido_id):
    pedido = Pedido.query.get(pedido_id)
    if not pedido:
        return jsonify({'error': 'Pedido não encontrado'}), 404

    data = request.get_json()
    usuario_id = data.get('usuario_id')
    tipo_usuario = data.get('tipo_usuario')

    if not usuario_id or tipo_usuario not in ['cliente', 'restaurante']:
        return jsonify({'error': 'Informações de usuário inválidas'}), 400

    status_atual = pedido.status_atual
    proximo_status = None

    if tipo_usuario == 'restaurante':
        if status_atual == 'aguardando_aceite':
            proximo_status = 'em_preparo'
        elif status_atual == 'em_preparo':
            proximo_status = 'em_entrega'
    elif tipo_usuario == 'cliente' and status_atual == 'em_entrega':
        proximo_status = 'entregue'

    if not proximo_status:
        return jsonify({'error': 'Ação não permitida para este status/usuário'}), 400

    fase_atual = PedidoFase.query.filter_by(pedido_id=pedido.id, fase=status_atual, data_fim=None).first()
    if fase_atual:
        fase_atual.data_fim = db.func.current_timestamp()

    nova_fase = PedidoFase(
        pedido_id=pedido.id,
        fase=proximo_status,
        data_fim=db.func.current_timestamp() if proximo_status == 'entregue' else None
    )
    db.session.add(nova_fase)
    pedido.status_atual = proximo_status
    db.session.commit()

    return jsonify({'mensagem': f'Pedido avançado para "{proximo_status}"'}), 200

@pedido_bp.route('/<int:pedido_id>/recusar', methods=['POST'])
def recusar_pedido(pedido_id):
    pedido = Pedido.query.get(pedido_id)
    if not pedido or pedido.status_atual != 'aguardando_aceite':
        return jsonify({'error': 'Pedido inválido para recusa'}), 400

    data = request.get_json()
    usuario_id = data.get('usuario_id')
    motivo = data.get('motivo')

    if not usuario_id or not motivo:
        return jsonify({'error': 'Dados incompletos'}), 400

    fase_atual = PedidoFase.query.filter_by(pedido_id=pedido.id, fase='aguardando_aceite', data_fim=None).first()
    if fase_atual:
        fase_atual.data_fim = db.func.current_timestamp()

    fase_recusa = PedidoFase(
        pedido_id=pedido.id,
        fase='recusado',
        motivo_recusa=motivo,
        usuario_responsavel_id=usuario_id,
        data_fim=db.func.current_timestamp()
    )
    db.session.add(fase_recusa)
    pedido.status_atual = 'recusado'
    db.session.commit()

    return jsonify({'mensagem': 'Pedido recusado com sucesso'}), 200
