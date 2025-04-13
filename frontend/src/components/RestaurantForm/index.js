import React from 'react';
import './index.css';

const RestaurantForm = ({ mode, formData, onChange, onImageChange, onSubmit, types }) => {
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

      <div className="form-group">
        <label htmlFor="image">Imagem do Restaurante</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={onImageChange}
        />
      </div>

      {formData.image_base64 && (
        <div className="image-preview">
          <p>Prévia da imagem atual:</p>
          <img
            src={formData.image_base64}
            alt="Imagem do Restaurante"
            style={{ width: '150px', borderRadius: '8px', marginTop: '8px' }}
          />
        </div>
      )}

      <button onClick={onSubmit}>Salvar</button>
    </div>
  );
};

export default RestaurantForm;
