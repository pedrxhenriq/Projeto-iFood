import React, { useState, useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import './index.css';

const API_URL = 'http://localhost:5000/login/';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginTradicional = async () => {
    try {
      const response = await axios.post(`${API_URL}`, formData);
      login(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao logar');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name } = decoded;

      const response = await axios.post(`${API_URL}google`, {
        email,
        nome: name,
      });

      login(response.data.user);
      navigate('/');
    } catch (err) {
        setError(err.response?.data?.error || 'Erro no login com Google');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Entrar no sistema</h2>

        <div className="login-section">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
          />
          <button onClick={handleLoginTradicional}>Entrar com e-mail e senha</button>
        </div>

        <div className="divider">ou</div>

        <div className="login-section">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError('Erro no login com Google')}
          />
        </div>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
