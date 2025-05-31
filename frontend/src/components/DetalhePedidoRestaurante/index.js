import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const DetalhePedidoRestaurante = ({ pedidoId, onVoltar }) => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPedido = async () => {
    const res = await axios.get(`/pedidos/${pedidoId}/detalhes`);
    setPedido(res.data);
  };

  useEffect(() => {
    fetchPedido();
  }, [pedidoId]);

  const handleAvancarFase = async () => {
    setLoading(true);
    try {
      await axios.post(`/pedidos/${pedidoId}/avancar`);
      await fetchPedido();
    } catch (err) {
      alert('Erro ao avançar fase');
    }
    setLoading(false);
  };

  if (!pedido) return <p>Carregando...</p>;

  return (
    <div className="detalhe-restaurante">
      <button onClick={onVoltar}>← Voltar</button>
      <h2>Pedido #{pedido.id}</h2>
      <p>Status atual: <span className={`status ${pedido.status_atual}`}>{pedido.status_atual}</span></p>
      <p>Total: R$ {pedido.total.toFixed(2)}</p>

      <h3>Itens</h3>
      {pedido.itens.map((item, i) => (
        <div key={i} className="item-pedido">
          <p><strong>{item.produto_nome}</strong> - {item.quantidade}x</p>
          <p>R$ {item.preco_unitario.toFixed(2)}</p>
        </div>
      ))}

      <button onClick={handleAvancarFase} disabled={loading || pedido.status_atual === 'entregue'}>
        Avançar Fase
      </button>
    </div>
  );
};

export default DetalhePedidoRestaurante;
