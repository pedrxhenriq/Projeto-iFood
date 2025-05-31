import './index.css';
import { FaTimes, FaHome, FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/pedido';

const traduzirStatus = (status) => {
  switch (status) {
    case 'aguardando_aceite':
      return 'Aguardando Aceite';
    case 'em_preparo':
      return 'Em Preparo';
    case 'em_entrega':
      return 'Em Entrega';
    case 'entregue':
      return 'Entregue';
    case 'recusado':
      return 'Recusado';
    default:
      return status;
  }
};

const PedidoModal = ({ pedidoId, onClose, tipoUsuario, onAtualizar, restauranteId = null }) => {
  const [pedido, setPedido] = useState(null);
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    const fetchPedido = async () => {
      const res = await axios.get(`${API_URL}/${pedidoId}`);
      setPedido(res.data);
    };
    fetchPedido();
  }, [pedidoId]);

  if (!pedido) return null;

  const handleAvancarPedido = async () => {
    try {
      await axios.post(`${API_URL}/${pedidoId}/avancar`, {
        usuario_id: usuario.id,
        tipo_usuario: tipoUsuario
      });
      alert('Pedido avançado com sucesso!');
      const restaurante = restauranteId || pedido?.itens?.[0]?.restaurante_id;
      onAtualizar(restaurante);
      onClose();
    } catch (error) {
      alert('Erro ao avançar pedido');
    }
  };

  const handleAceitarPedido = handleAvancarPedido;

  const handleRecusarPedido = async () => {
    const motivo = prompt('Informe o motivo da recusa:');
    if (!motivo) return;

    try {
      await axios.post(`${API_URL}/${pedidoId}/recusar`, {
        usuario_id: 1,
        motivo
      });
      alert('Pedido recusado com sucesso!');
      const restaurante = restauranteId || pedido?.itens?.[0]?.restaurante_id;
      onAtualizar(restaurante);
      onClose();
    } catch (error) {
      alert('Erro ao recusar pedido.');
    }
  };

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2>Pedido #{pedido.id}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="pedido-status">
          <strong>Status:</strong> {traduzirStatus(pedido.status_atual)}
        </div>

        <div className="cart-items">
          {pedido.itens.map((item, index) => (
            <div key={index} className="cart-item">
              <img
                src={item.imagem?.startsWith('data:image') ? item.imagem : `data:image/png;base64,${item.imagem}`}
                alt={item.produto_nome}
                className="item-image"
              />
              <div className="item-details">
                <div className="item-name">{item.produto_nome}</div>
                <div className="item-description">
                  {item.descricao?.length > 30 ? item.descricao.slice(0, 30) + '...' : item.descricao}
                </div>
                <div className="item-price">R$ {item.preco_unitario.toFixed(2)}</div>
                <div className="item-quantity">Qtd: {item.quantidade}</div>
              </div>
            </div>
          ))}
        </div>

        <h3>Histórico do Pedido</h3>
        {pedido.fases.map((fase, i) => (
          <div key={i} className="fase-item">
            <strong>{traduzirStatus(fase.fase)}</strong>
            Início: {new Date(fase.data_inicio).toLocaleString()}<br />
            {fase.data_fim && <>Fim: {new Date(fase.data_fim).toLocaleString()}<br /></>}

            {fase.fase === 'recusado' && (
              <>
                {fase.motivo_recusa && (
                  <>Motivo: <em>{fase.motivo_recusa}</em><br /></>
                )}
                {fase.responsavel?.nome && (
                  <div className="responsavel">
                    Responsável: <strong>{fase.responsavel.nome}</strong>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        <h3>Informações de Entrega</h3>
        <p><strong>Tipo:</strong> {pedido.tipo_entrega === 'entregar' ? 'Entrega' : 'Retirada no local'}</p>
        {pedido.endereco && (
          <div className="address-card selected" style={{ marginTop: '1rem' }}>
            <div className="address-icon">
              <FaHome size={20} />
            </div>
            <div className="address-info">
              <div className="address-text">
                {pedido.endereco.logradouro}, {pedido.endereco.numero}
              </div>
              <div className="address-text">
                {pedido.endereco.bairro}
              </div>
              <div className="address-text">
                {pedido.endereco.cidade}/{pedido.endereco.estado}
              </div>
              {pedido.tipo_entrega === 'entregar' && (
                <div className="delivery-time">
                  Tempo de entrega: {pedido.tempo_entrega} min
                </div>
              )}
            </div>
            <div className="address-selected-icon">
              <FaCheckCircle size={20} />
            </div>
          </div>
        )}
        <p>
          <strong>Pagamento:</strong>{' '}
          {pedido.pagamento
            ? `${pedido.pagamento.metodo} (${pedido.pagamento.tipo_pagamento})`
            : 'Não informado'}
        </p>

        <h3>Totais</h3>
        <div className="tempo-estimado-box">
          <div>Preparo: <strong>{pedido.tempo_preparo} min</strong></div>
          <div>Entrega: <strong>{pedido.tempo_entrega} min</strong></div>
          <div>Previsão total: <strong>{pedido.tempo_total_estimado} min</strong></div>
          <div>Total: <strong>R$ {pedido.total.toFixed(2)}</strong></div>
        </div>

        {tipoUsuario === 'restaurante' && pedido.status_atual === 'aguardando_aceite' && (
          <div className="pedido-actions">
            <button className="avancar" onClick={handleAceitarPedido}>Aceitar Pedido</button>
            <button className="recusar" onClick={handleRecusarPedido}>Recusar Pedido</button>
          </div>
        )}

        {tipoUsuario === 'restaurante' && pedido.status_atual === 'em_preparo' && (
          <div className="pedido-actions">
            <button className="avancar" onClick={handleAvancarPedido}>Enviar para Entrega</button>
          </div>
        )}

        {tipoUsuario === 'cliente' && pedido.status_atual === 'em_entrega' && (
          <div className="pedido-actions">
            <button className="avancar" onClick={handleAvancarPedido}>Confirmar Recebimento</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PedidoModal;
