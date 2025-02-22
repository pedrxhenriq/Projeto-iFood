import React from 'react';
import './index.css';

const UserForm = ({ mode, formData, onChange, onSubmit }) => {
  return (
    <div className="user-form">
      <h3>{mode === 'create' ? 'Cadastrar Usuário' : 'Alterar Usuário'}</h3>
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={onChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
      />
      <input
        type="text"
        name="cpf"
        placeholder="CPF"
        value={formData.cpf}
        onChange={onChange}
      />
      <input
        type="text"
        name="telefone"
        placeholder="Telefone"
        value={formData.telefone}
        onChange={onChange}
      />
      <button onClick={onSubmit}>Salvar</button>
    </div>
  );
};

export default UserForm;
