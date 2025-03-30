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

const RestaurantList = ({ restaurants, onEdit, onDelete, onReactivate, page, totalPages, onPageChange }) => {
  return (
    <div>
      <table className="restaurant-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td>{restaurant.id}</td>
              <td>{restaurant.nome}</td>
              <td>{restaurant.cnpj}</td>
              <td>{restaurant.telefone}</td>
              <td>{restaurant.endereco}</td>
              <td>{restaurant.categoria}</td>
              <td>{restaurant.ativo ? 'Ativo' : 'Inativo'}</td>
              <td>
                {restaurant.ativo ? (
                  <>
                    <button className="edit-btn" onClick={() => onEdit(restaurant)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => onDelete(restaurant.id)}>
                      <FaTrash />
                    </button>
                  </>
                ) : (
                  <button className="reactivate-btn" onClick={() => onReactivate(restaurant.id)}>
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

export default RestaurantList;
