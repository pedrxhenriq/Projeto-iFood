import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>ifood</div>
      <nav className="nav">
        <span className="nav-item">Entregador</span>
        <span className="nav-item">Restaurante e Mercado</span>
        <span className="nav-item">Carreiras</span>
        <span className="nav-item">iFood Card</span>
        <span className="nav-item">Para Empresas</span>
      </nav>
      <div className="user-actions-home">
        <span className="nav-item create-account" onClick={() => navigate('/users')}>Usuários</span>
        <button className="login-button">Entrar</button>
      </div>
    </header>
  );
};

export default Header;
