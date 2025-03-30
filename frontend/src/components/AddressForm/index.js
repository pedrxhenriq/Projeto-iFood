import React from 'react';
import './index.css';

const AddressForm = ({ mode, formData, onChange, onSubmit, onCepLookup }) => {
  const handleCepChange = (e) => {
    const value = e.target.value;
    onChange(e);

    if (value.length === 8 && /^[0-9]{8}$/.test(value)) {
      onCepLookup(value);
    }
  };

  return (
    <div className="address-form">
      <h3>{mode === 'create' ? 'Cadastrar Endereço' : 'Alterar Endereço'}</h3>
      <input
        type="text"
        name="logradouro"
        placeholder="Logradouro *"
        value={formData.logradouro}
        onChange={onChange}
      />
      <input
        type="text"
        name="numero"
        placeholder="Número *"
        value={formData.numero}
        onChange={onChange}
      />
      <input
        type="text"
        name="complemento"
        placeholder="Complemento"
        value={formData.complemento}
        onChange={onChange}
      />
      <input
        type="text"
        name="bairro"
        placeholder="Bairro"
        value={formData.bairro}
        onChange={onChange}
      />
      <input
        type="text"
        name="cidade"
        placeholder="Cidade *"
        value={formData.cidade}
        onChange={onChange}
      />
      <input
        type="text"
        name="estado"
        placeholder="UF *"
        maxLength={2}
        value={formData.estado}
        onChange={onChange}
      />
      <input
        type="text"
        name="cep"
        placeholder="CEP *"
        maxLength={8}
        value={formData.cep}
        onChange={handleCepChange}
      />

      <button onClick={onSubmit}>Salvar</button>
    </div>
  );
};

export default AddressForm;
