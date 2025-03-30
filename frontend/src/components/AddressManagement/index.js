import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AddressList from '../AddressList';
import AddressForm from '../AddressForm';
import { AuthContext } from '../../contexts/AuthContext';
import './index.css';

const API_URL = 'http://localhost:5000/users/enderecos/';

const AddressManagement = () => {
  const { usuario } = useContext(AuthContext);
  const [view, setView] = useState('list');
  const [enderecos, setEnderecos] = useState([]);
  const [formData, setFormData] = useState({
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (view === 'list' && usuario) fetchEnderecos();
  }, [view, usuario]);

  const fetchEnderecos = async () => {
    try {
      const response = await axios.get(`${API_URL}${usuario.id}`);
      setEnderecos(response.data);
    } catch (error) {
      console.error('Erro ao buscar endereços', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    });
    setSelectedAddress(null);
  };

  const onCepLookup = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;
  
      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }
  
      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || ''
      }));
    } catch (error) {
      alert('Erro ao buscar o CEP');
      console.error(error);
    }
  };  

  const validateFormData = (data) => {
    const { logradouro, numero, cidade, estado, cep } = data;
    if (!logradouro || !numero || !cidade || !estado || !cep) {
      alert('Preencha todos os campos obrigatórios.');
      return false;
    }

    const cepNumerico = /^[0-9]{8}$/;

    if (!cepNumerico.test(cep)) {
      alert('O CEP deve conter exatamente 8 dígitos numéricos, sem traços ou letras.');
      return false;
    }

    return true;
  };

  const handleCreateAddress = async () => {
    if (!validateFormData(formData)) return;

    try {
      await axios.post(API_URL, {
        ...formData,
        user_id: usuario.id
      });
      resetForm();
      setView('list');
    } catch (error) {
      console.error('Erro ao cadastrar endereço', error);
    }
  };

  const handleUpdateAddress = async () => {
    if (!validateFormData(formData) || !selectedAddress) return;

    try {
      await axios.patch(`${API_URL}${selectedAddress.id}`, formData);
      resetForm();
      setView('list');
    } catch (error) {
      console.error('Erro ao atualizar endereço', error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      fetchEnderecos();
    } catch (error) {
      console.error('Erro ao remover endereço', error);
    }
  };

  const handleReactiveAddress = async (id) => {
    try {
      await axios.post(`${API_URL}${id}`);
      fetchEnderecos();
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
    }
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setFormData(address);
    setView('update');
  };

  const handleSubmit = () => {
    if (view === 'create') {
      handleCreateAddress();
    } else if (view === 'update') {
      handleUpdateAddress();
    }
  };

  return (
    <div className="address-management">
      <h2>Meus Endereços</h2>
      <div className="address-actions">
        <button onClick={() => setView('list')}>Listar</button>
        <button onClick={() => { resetForm(); setView('create'); }}>Cadastrar</button>
      </div>
      <div className="address-content">
        {view === 'list' && (
          <AddressList
            addresses={enderecos}
            onEdit={handleEdit}
            onDelete={handleDeleteAddress}
            onReactivate={handleReactiveAddress}
          />
        )}
        {(view === 'create' || view === 'update') && (
          <AddressForm
            mode={view}
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCepLookup={onCepLookup}
          />
        )}
      </div>
    </div>
  );
};

export default AddressManagement;
