import React from 'react';
import './index.css';

const RestaurantForm = ({ mode, formData, onChange, onSubmit }) => {
  return (
    <div className="restaurant-form">
      <h3>{mode === 'create' ? 'Cadastrar Restaurante' : 'Alterar Restaurante'}</h3>
      <input
        type="text"
        name="nome"
        placeholder="Nome do Restaurante"
        value={formData.nome}
        onChange={onChange}
      />
      <input
        type="text"
        name="cnpj"
        placeholder="CNPJ"
        maxLength={14}
        value={formData.cnpj}
        onChange={onChange}
      />
      <input
        type="text"
        name="telefone"
        placeholder="Telefone"
        maxLength={11}
        value={formData.telefone}
        onChange={onChange}
      />
      <input
        type="text"
        name="endereco"
        placeholder="Endereço"
        value={formData.endereco}
        onChange={onChange}
      />
      <input
        type="text"
        name="categoria"
        placeholder="Categoria (Ex: Pizzaria, Sushi, etc.)"
        value={formData.categoria}
        onChange={onChange}
      />
      <button onClick={onSubmit}>Salvar</button>
    </div>
  );
};

export default RestaurantForm;
