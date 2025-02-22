import React from 'react';
import './index.css';
import background from '../../assets/alimentos-bg.webp';

const categories = [
  'Frios', 'Laticínios', 'Feira', 'Bebidas', 'Doces', 'Massas frescas',
  'Limpeza', 'Padaria', 'Higiene', 'Congelados', 'Carnes', 'Cerveja'
];

const Marketplace = () => {
  return (
    <div className="marketplace-container">
      <div className="marketplace-background">
        <img src={background} alt="Alimentos" />
      </div>
      <div className="marketplace-content">
        <h1 className="marketplace-title">Faça mercado no iFood</h1>
        <p className="marketplace-description">
          Entregamos tudo o que precisa na porta da sua casa, de hortifrúti a itens de limpeza
        </p>
        
        <div className="marketplace-search-box">
          <input type="text" placeholder="📍 Em qual endereço você está?" />
          <button>Ver mercados próximos</button>
        </div>

        <div className="marketplace-categories">
          {categories.map((item, index) => (
            <span key={index} className="marketplace-category-item">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
