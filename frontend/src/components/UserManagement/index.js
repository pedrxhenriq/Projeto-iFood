import React, { useState } from 'react';
import './index.css';

const UserManagement = () => {
  const [view, setView] = useState('list');

  const renderContent = () => {
    switch (view) {
      case 'list':
        return <div>Aqui será exibida a lista de usuários.</div>;
      case 'create':
        return <div>Formulário para cadastrar usuário.</div>;
      case 'update':
        return <div>Formulário para atualizar usuário.</div>;
      case 'delete':
        return <div>Funcionalidade para deletar usuário.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="user-management">
      <h2>Gestão de Usuários</h2>
      <div className="user-actions">
        <button onClick={() => setView('list')}>Listar</button>
        <button onClick={() => setView('create')}>Cadastrar</button>
        <button onClick={() => setView('update')}>Alterar</button>
        <button onClick={() => setView('delete')}>Deletar</button>
      </div>
      <div className="user-content">{renderContent()}</div>
    </div>
  );
};

export default UserManagement;