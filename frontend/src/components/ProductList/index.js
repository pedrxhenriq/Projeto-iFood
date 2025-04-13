import React from 'react';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import Pagination from '../Pagination/index.js';
import './index.css';

const ProductList = ({ products, onEdit, onDelete, onReactivate, page, totalPages, onPageChange }) => {
    return (
        <div>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Tempo</th>
                        <th>Restaurante</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(prod => (
                        <tr key={prod.id}>
                            <td>{prod.id}</td>
                            <td>
                                {prod.image_base64 && (
                                    <img src={prod.image_base64} alt={prod.name} style={{ width: '80px' }} />
                                )}
                            </td>
                            <td>{prod.name}</td>
                            <td>R$ {parseFloat(prod.price).toFixed(2)}</td>
                            <td>{prod.preparation_time} min</td>
                            <td>{prod.restaurant_name}</td>
                            <td>
                                {prod.is_active ? (
                                    <>
                                        <button className="edit-btn" onClick={() => onEdit(prod)}>
                                            <FaEdit />
                                        </button>
                                        <button className="delete-btn" onClick={() => onDelete(prod.id)}>
                                            <FaTrash />
                                        </button>
                                    </>
                                ) : (
                                    <button className="reactivate-btn" onClick={() => onReactivate(prod.id)}>
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

export default ProductList;
