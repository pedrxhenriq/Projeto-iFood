import React from 'react';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import Pagination from '../Pagination/index.js';
import './index.css';

const formatCPF = (cpf) => {
  if (!cpf) return 'N/A';
  return cpf.toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatTelefone = (telefone) => {
  if (!telefone) return 'N/A';
  const cleaned = telefone.toString().replace(/\D/g, '');

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return telefone;
};

const UserList = ({ users, onEdit, onDelete, onReactivate, page, totalPages, onPageChange }) => {
  return (
    <div>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{formatCPF(user.cpf)}</td>
              <td>{formatTelefone(user.telefone)}</td>
              <td>{user.ativo ? 'Ativo' : 'Inativo'}</td>
              <td>
                {user.ativo ? (
                  <>
                    <button className="edit-btn" onClick={() => onEdit(user)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => onDelete(user.id)}>
                      <FaTrash />
                    </button>
                  </>
                ) : (
                  <button className="reactivate-btn" onClick={() => onReactivate(user.id)}>
                    <FaUndo />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};

export default UserList;
