import React from 'react';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import './index.css';

const AddressList = ({ addresses, onEdit, onDelete, onReactivate }) => {
  if (!addresses.length) {
    return <p className="empty-message">Nenhum endereço cadastrado.</p>;
  }

  return (
    <div>
      <table className="address-table">
        <thead>
          <tr>
            <th>Logradouro</th>
            <th>Número</th>
            <th>Complemento</th>
            <th>Bairro</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>CEP</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((endereco) => (
            <tr key={endereco.id}>
              <td>{endereco.logradouro}</td>
              <td>{endereco.numero}</td>
              <td>{endereco.complemento}</td>
              <td>{endereco.bairro}</td>
              <td>{endereco.cidade}</td>
              <td>{endereco.estado}</td>
              <td>{endereco.cep}</td>
              <td>
                {endereco.ativo ? (
                  <>
                    <button className="edit-btn" onClick={() => onEdit(endereco)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => onDelete(endereco.id)}>
                      <FaTrash />
                    </button>
                  </>
                ) : (
                  <button className="reactivate-btn" onClick={() => onReactivate(endereco.id)}>
                    <FaUndo />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddressList;
