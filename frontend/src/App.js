import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/index.js';
import Marketplace from './components/Marketplace/index.js';
import UserManagement from './components/UserManagement/index.js';
import RestaurantManagement from './components/RestaurantManagement/index.js';
import ProductManagement from './components/ProductManagement/index.js';
import AddressManagement from './components/AddressManagement/index.js';
import MeusPedidos from './components/MeusPedidos/index.js';
import PedidosRestaurante from './components/PedidosRestaurante/index.js';
import Relatorio from './components/Static/index.js';
import Login from './components/Login/index.js';
import PrivateRoute from './components/PrivateRoute/index.js';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <div className="App">
        <Header cart={cart} setCart={setCart} />
        <main>
          <Routes>
            <Route path="/" element={<Marketplace cart={cart} setCart={setCart} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<PrivateRoute element={<UserManagement />} />} />
            <Route path="/enderecos" element={<PrivateRoute element={<AddressManagement />} />} />
            <Route path="/restaurantes" element={<PrivateRoute element={<RestaurantManagement />} />} />
            <Route path="/produtos" element={<PrivateRoute element={<ProductManagement />} />} />
            <Route path="/meus-pedidos" element={<PrivateRoute element={<MeusPedidos />} />} />
            <Route path="/restaurante-pedidos" element={<PrivateRoute element={<PedidosRestaurante />} />} />
            <Route path="/analytics" element={<PrivateRoute element={<Relatorio />} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
