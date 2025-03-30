import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantList from '../RestaurantList/index.js';
import RestaurantForm from '../RestaurantForm/index.js';
import './index.css';

const API_URL = 'http://localhost:5000/users/';

const RestaurantManagement = () => {
  const [view, setView] = useState('list');
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({ nome: '', email: '', cpf: '', telefone: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (view === 'list') fetchRestaurant();
  }, [view, page]);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(API_URL, { params: { page, per_page: 5 } });
      setRestaurants(response.data.users);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ nome: '', email: '', cpf: '', telefone: '' });
    setSelectedUser(null);
  };

  const validateFormData = ({ nome, email, cpf, telefone }) => {
    if (!nome) {
      alert('Preencha o nome do usuário antes de prosseguir.');
      return false;
    }
    if (!email) {
      alert('Preencha o email do usuário antes de prosseguir.');
      return false;
    }

    const isValidCPF = cpf && cpf.toString().length === 11 && /^\d+$/.test(cpf.toString());
    const isValidTelefone = telefone && (telefone.toString().length === 11 || telefone.toString().length === 10) && /^\d+$/.test(telefone.toString());

    if (!isValidCPF) {
      alert('O CPF deve conter 11 dígitos numéricos.');
      return false;
    }
    if (!isValidTelefone) {
      alert('O Telefone deve conter 10 ou 11 dígitos numéricos.');
      return false;
    }

    return true;
  };

  const handleCreateRestaurant = async () => {
    if (!validateFormData(formData)) return;

    try {
      await axios.post(API_URL, formData);
      resetForm();
      setView('list');
    } catch (error) {
      console.error('Erro ao cadastrar usuário', error);
    }
  };

  const handleUpdateRestaurant = async () => {
    if (!validateFormData(formData) || !selectedUser) return;

    try {
      await axios.patch(`${API_URL}${selectedUser.id}`, formData);
      resetForm();
      setView('list');
    } catch (error) {
      console.error('Erro ao atualizar usuário', error);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      fetchRestaurant();
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
    }
  };

  const handleReactivateRestaurant = async (id) => {
    try {
      await axios.post(`${API_URL}${id}`);
      fetchRestaurant();
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setView('update');
  };

  const handleSubmit = () => {
    if (view === 'create') {
      handleCreateRestaurant();
    } else if (view === 'update') {
      handleUpdateRestaurant();
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="restaurant-management">
      <h2>Gestão de Restaurantes</h2>
      <div className="restaurant-actions">
        <button onClick={() => setView('list')}>Listar</button>
        <button onClick={() => { resetForm(); setView('create'); }}>Cadastrar</button>
      </div>
      <div className="restaurant-content">
        {view === 'list' && (
          <RestaurantList
            restaurants={restaurants}
            onEdit={handleEdit}
            onDelete={handleDeleteRestaurant}
            onReactivate={handleReactivateRestaurant}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        {(view === 'create' || view === 'update') && (
          <RestaurantForm
            mode={view}
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default RestaurantManagement;
