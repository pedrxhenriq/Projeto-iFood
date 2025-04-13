import React from 'react';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import Pagination from '../Pagination/index.js';
import './index.css';

const formatCNPJ = (cnpj) => {
  if (!cnpj) return 'N/A';

  const cleaned = cnpj.toString().padStart(14, '0').replace(/\D/g, '');

  if (cleaned.length !== 14) return cnpj;

  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
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
            <th>Imagem</th>
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
          {restaurants?.map((restaurant) => (
            <tr key={restaurant.id}>
              <td>{restaurant.id}</td>
              <td>
                {restaurant.image_base64 && (
                  <img src={restaurant.image_base64} alt={restaurant.name} style={{ width: '80px' }} />
                )}
              </td>
              <td>{restaurant.name}</td>
              <td>{formatCNPJ(restaurant.cnpj)}</td>
              <td>{formatTelefone(restaurant.phone)}</td>
              <td>{restaurant.address}</td>
              <td>{restaurant.restaurant_type}</td>
              <td>{restaurant.is_active ? 'Ativo' : 'Inativo'}</td>
              <td>
                {restaurant.is_active ? (
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
