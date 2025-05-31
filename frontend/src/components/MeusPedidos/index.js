import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PedidoCard from '../PedidoCard';
import PedidoModal from '../PedidoModal';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './index.css';

const API_URL = 'http://localhost:5000/pedido/';

const MeusPedidos = () => {
  const { usuario } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const fetchPedidos = async () => {
    const res = await axios.get(`${API_URL}usuario/${usuario.id}`);
    setPedidos(res.data);
  };

  useEffect(() => {
    fetchPedidos();
  }, [usuario.id]);

  const onSelecionarPedido = (id) => {
    setPedidoSelecionado(id);
  };

  return (
    <div className="meus-pedidos">
      <h2>Meus Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
      ) : (
        pedidos.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onClick={() => onSelecionarPedido(pedido.id)}
          />
        ))
      )}

      {pedidoSelecionado && (
        <PedidoModal
          pedidoId={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
          tipoUsuario="cliente"
          onAtualizar={fetchPedidos}
        />
      )}
    </div>
  );
};

export default MeusPedidos;
