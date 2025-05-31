import './index.css';

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

const PedidoCard = ({ pedido, onClick }) => {
  return (
    <div className="pedido-card" onClick={onClick}>
      <h4>Pedido #{pedido.id}</h4>
      <p>Status: <span className={`status ${pedido.status}`}>{traduzirStatus(pedido.status)}</span></p>
      <p>Restaurante: {pedido.restaurante}</p>
      <p>Data: {new Date(pedido.data_pedido).toLocaleString()}</p>
      <p>Total: R$ {pedido.total.toFixed(2)}</p>
    </div>
  );
};

export default PedidoCard;
