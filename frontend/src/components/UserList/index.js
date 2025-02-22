import React from 'react';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import Pagination from '../Pagination/index.js';
import './index.css';

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
              <td>{user.cpf || 'N/A'}</td>
              <td>{user.telefone || 'N/A'}</td>
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
