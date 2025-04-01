import React from 'react';
import './index.css';

const RestaurantForm = ({ mode, formData, onChange, onSubmit, types }) => {
  return (
    <div className="restaurant-form">
      <h3>{mode === 'create' ? 'Cadastrar Restaurante' : 'Alterar Restaurante'}</h3>

      <input
        type="text"
        name="name"
        placeholder="Nome do Restaurante"
        value={formData.name}
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
        name="phone"
        placeholder="Telefone"
        maxLength={11}
        value={formData.phone}
        onChange={onChange}
      />

      <input
        type="text"
        name="address"
        placeholder="Endereço"
        value={formData.address}
        onChange={onChange}
      />

      <select
        name="restaurant_type_id"
        value={formData.restaurant_type_id}
        onChange={onChange}
      >
        <option value="">Selecione uma categoria</option>
        {types?.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      <button onClick={onSubmit}>Salvar</button>
    </div>
  );
};

export default RestaurantForm;
