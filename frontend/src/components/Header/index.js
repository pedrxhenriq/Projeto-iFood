import React, { useContext, useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './index.css';
import CartModal from '../Cart/index.js';

const Header = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const { usuario, logout } = useContext(AuthContext);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>ifood</div>

      {usuario ? (
        <>
          <nav className="nav">
            <span className="nav-item" onClick={() => navigate('/restaurantes')}>Restaurantes</span>
            <span className="nav-item" onClick={() => navigate('/produtos')}>Produtos</span>
            <span className="nav-item" onClick={() => navigate('/users')}>Usuários</span>
            <span className="nav-item" onClick={() => navigate('/enderecos')}>Endereços</span>
          </nav>

          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            <FaShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </div>

          <div className="user-actions-home">
            <span className="nav-item user-name">Olá, {usuario.nome}</span>
            <button className="logout-button" onClick={handleLogout}>Sair</button>
          </div>
        </>
      ) : (
        <div className="user-actions-home">
          <button className="login-button" onClick={() => navigate('/login')}>Entrar</button>
        </div>
      )}

      {isCartOpen && (
        <CartModal cart={cart} setCart={setCart} onClose={() => setIsCartOpen(false)} />
      )}
    </header>
  );
};

export default Header;
