import { useEffect, useState } from 'react';
import axios from 'axios';
import PedidoCard from '../PedidoCard';
import PedidoModal from '../PedidoModal';
import { AuthContext } from '../../contexts/AuthContext';
import './index.css';

const API_URL = 'http://localhost:5000/pedido/';

const PedidosRestaurante = () => {
  const [pedidos, setPedidos] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restauranteSelecionado, setRestauranteSelecionado] = useState('');
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const fetchRestaurants = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/products/restaurants`);
      setRestaurants(data || []);
    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
    }
  };

  const fetchPedidos = async (restauranteId) => {
    const res = await axios.get(`${API_URL}restaurante/${restauranteId}`);
    setPedidos(res.data);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (restauranteSelecionado) {
      fetchPedidos(restauranteSelecionado);
    } else {
      setPedidos([]);
    }
  }, [restauranteSelecionado]);

  const onSelecionarPedido = (id) => {
    setPedidoSelecionado(id);
  };

  return (
    <div className="pedidos-restaurante">
      <h2>Pedidos Recebidos</h2>

      <select
        value={restauranteSelecionado}
        onChange={(e) => setRestauranteSelecionado(e.target.value)}
        className="select-restaurante"
      >
        <option value="">Selecione um restaurante</option>
        {restaurants.map((rest) => (
          <option key={rest.id} value={rest.id}>
            {rest.name}
          </option>
        ))}
      </select>

      {restauranteSelecionado && pedidos.length === 0 && (
        <p>Este restaurante ainda não recebeu pedidos.</p>
      )}

      {pedidos.length > 0 &&
        pedidos.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onClick={() => onSelecionarPedido(pedido.id)}
          />
        ))}

      {pedidoSelecionado && (
        <PedidoModal
          pedidoId={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
          tipoUsuario="restaurante"
          onAtualizar={fetchPedidos}
          restauranteId={restauranteSelecionado}
        />
      )}
    </div>
  );
};

export default PedidosRestaurante;
