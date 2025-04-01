import React from 'react';
import './index.css';

const ProductForm = ({ mode, formData, onChange, onSubmit, restaurants }) => {
  return (
    <div className="restaurant-form">
      <h3>{mode === 'create' ? 'Cadastrar Produto' : 'Alterar Produto'}</h3>

      <input
        type="text"
        name="name"
        placeholder="Nome do Produto"
        value={formData.name}
        onChange={onChange}
      />

      <input
        type="number"
        name="preparation_time"
        placeholder="Tempo de preparo (min)"
        value={formData.preparation_time}
        onChange={onChange}
      />

      <input
        type="number"
        step="0.01"
        name="price"
        placeholder="Preço"
        value={formData.price}
        onChange={onChange}
      />

      <textarea
        name="description"
        placeholder="Descrição"
        value={formData.description}
        onChange={onChange}
      />

      <select
        name="restaurant_id"
        value={formData.restaurant_id}
        onChange={onChange}
      >
        <option value="">Selecione o restaurante</option>
        {restaurants.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <button onClick={onSubmit}>Salvar</button>
    </div>
  );
};

export default ProductForm;
