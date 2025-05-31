import React, { useEffect, useRef, useContext, useState } from 'react';
import { FaShoppingCart, FaClipboardList, FaChartBar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './index.css';
import CartModal from '../Cart/index.js';
import logo from '../../assets/logo.png';

const Header = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const { usuario, logout } = useContext(AuthContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPedidosOpen, setIsPedidosOpen] = useState(false);
  const pedidoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pedidoRef.current && !pedidoRef.current.contains(event.target)) {
        setIsPedidosOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>
        <img src={logo} alt="iFood" width={126} height={126} />
      </div>

      {usuario ? (
        <>
          <nav className="nav">
            <span className="nav-item" onClick={() => navigate('/restaurantes')}>Restaurantes</span>
            <span className="nav-item" onClick={() => navigate('/produtos')}>Produtos</span>
            <span className="nav-item" onClick={() => navigate('/users')}>Usuários</span>
            <span className="nav-item" onClick={() => navigate('/enderecos')}>Endereços</span>
          </nav>

          <div className="icon-group">
            <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
              <FaShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </div>

            <div className="pedido-icon-wrapper" ref={pedidoRef}>
              <div className="pedido-icon" onClick={() => setIsPedidosOpen(!isPedidosOpen)}>
                <FaClipboardList size={24} />
              </div>

              {isPedidosOpen && (
                <div className="pedido-dropdown">
                  <div className="pedido-option" onClick={() => navigate('/meus-pedidos')}>
                    Meus Pedidos
                  </div>
                  <div className="pedido-option" onClick={() => navigate('/restaurante-pedidos')}>
                    Pedidos Restaurante
                  </div>
                </div>
              )}
            </div>

            <div className="analytics-icon">
              <FaChartBar size={24} onClick={() => navigate('/analytics')} />
            </div>
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
