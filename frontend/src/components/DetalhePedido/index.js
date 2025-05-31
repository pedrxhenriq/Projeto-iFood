import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const DetalhePedido = ({ pedidoId, onVoltar }) => {
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const fetchDetalhes = async () => {
      const res = await axios.get(`/pedidos/${pedidoId}/detalhes`);
      setPedido(res.data);
    };

    fetchDetalhes();
  }, [pedidoId]);

  if (!pedido) return <p>Carregando...</p>;

  return (
    <div className="detalhe-pedido">
      <button onClick={onVoltar}>← Voltar</button>
      <h2>Detalhes do Pedido #{pedido.id}</h2>
      <p>Status atual: <span className={`status ${pedido.status_atual}`}>{pedido.status_atual}</span></p>
      <p>Tipo de entrega: {pedido.tipo_entrega}</p>
      <p>Total: R$ {pedido.total.toFixed(2)}</p>

      <h3>Itens</h3>
      {pedido.itens.map((item, i) => (
        <div key={i} className="item-pedido">
          <p><strong>{item.produto_nome}</strong> - {item.quantidade}x</p>
          <p>R$ {item.preco_unitario.toFixed(2)} cada</p>
          <p>Restaurante: {item.restaurante_nome}</p>
        </div>
      ))}

      <h3>Histórico</h3>
      {pedido.fases.map((f, i) => (
        <div key={i} className="fase-pedido">
          <p>Fase: <strong>{f.fase}</strong></p>
          <p>Início: {new Date(f.data_inicio).toLocaleString()}</p>
          {f.data_fim && <p>Fim: {new Date(f.data_fim).toLocaleString()}</p>}
        </div>
      ))}
    </div>
  );
};

export default DetalhePedido;
