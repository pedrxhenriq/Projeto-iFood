import React, { useState, useContext } from 'react';
import { FaTimes, FaHome, FaCheckCircle } from "react-icons/fa";
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import './index.css';

const API_URL = 'http://localhost:5000/pedido/';

const CartModal = ({ cart, setCart, onClose }) => {
    const { usuario } = useContext(AuthContext);

    const [stage, setStage] = useState('cart');

    const [enderecos, setEnderecos] = useState([]);
    const [selectedEnderecoId, setSelectedEnderecoId] = useState(null);
    const [tipoEntrega, setTipoEntrega] = useState('entregar');

    const [opcoesPagamento, setOpcoesPagamento] = useState([]);
    const [selectedPagamento, setSelectedPagamento] = useState(null);

    const updateQuantity = (id, quantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const fetchEnderecos = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/enderecos/${usuario.id}?ativos=1`);
            const dataComTempo = response.data.map(endereco => ({
                ...endereco,
                tempoEntrega: Math.floor(Math.random() * (20 - 8 + 1)) + 8
            }));
            setEnderecos(dataComTempo);
        } catch (error) {
            console.error('Erro ao buscar endereços', error);
        }
    };

    const fetchOpcoesPagamento = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/marketplace/opcoes-pagamento`);
            setOpcoesPagamento(response.data);
        } catch (error) {
            console.error('Erro ao buscar opções de pagamento', error);
        }
    };

    const handleContinue = () => {
        if (stage === 'cart') {
            fetchEnderecos();
            setStage('address');
        }
        else if (stage === 'address') {
            fetchOpcoesPagamento();
            setStage('payment');
        }
    };

    const handleBack = () => {
        if (stage === 'address') setStage('cart');
        if (stage === 'payment') setStage('address');
    };

    const handleRealizarPedido = async () => {
        if (!selectedPagamento) {
            alert('Selecione uma forma de pagamento!');
            return;
        }

        const resumoPedido = {
            user_id: usuario.id,
            tipoEntrega,
            endereco: tipoEntrega === 'entregar' ? enderecoSelecionado : 'Retirada no local',
            formaPagamento: opcoesPagamento.find(op => op.id === selectedPagamento),
            itens: cart,
            total: totalPrice.toFixed(2),
            tempoPreparo: `${maxPreparationTime} min`,
            tempoEntrega: tipoEntrega === 'entregar' && enderecoSelecionado
                ? `${enderecoSelecionado.tempoEntrega} min`
                : '-',
            tempoTotalEstimado: `${tempoTotalEstimado} min`
        };

        try {
            const response = await axios.post(`${API_URL}`, resumoPedido);
            alert('Pedido realizado com sucesso!');

            setCart([]);
            onClose();
        } catch (error) {
            console.error('Erro ao realizar o pedido:', error);
            alert('Houve um problema ao enviar seu pedido. Tente novamente.');
        }
    };

    const enderecoSelecionado = enderecos.find(e => e.id === selectedEnderecoId);

    const maxPreparationTime = cart.length > 0 ? Math.max(...cart.map(item => item.preparation_time)) : 0;

    const tempoTotalEstimado = tipoEntrega === 'entregar' && enderecoSelecionado
        ? maxPreparationTime + enderecoSelecionado.tempoEntrega
        : maxPreparationTime;

    return (
        <div className="cart-modal-overlay">
            <div className="cart-modal">
                <div className="cart-header">
                    <h2>
                        {stage === 'cart' && 'Carrinho'}
                        {stage === 'address' && 'Escolher Endereço'}
                        {stage === 'payment' && 'Resumo'}
                    </h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                {stage === 'cart' && (
                    <>
                        {cart.length === 0 ? (
                            <p>Carrinho vazio</p>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map(item => (
                                        <div key={item.id} className="cart-item">
                                            <img
                                                src={item.image_base64.startsWith('data:image') ? item.image_base64 : `data:image/png;base64,${item.image_base64}`}
                                                alt={item.name}
                                                className="item-image"
                                            />
                                            <div className="item-details">
                                                <div className="item-name">{item.name}</div>
                                                <div className="item-description">
                                                    {item.description.length > 30
                                                        ? item.description.slice(0, 30) + "..."
                                                        : item.description}
                                                </div>
                                                <div className="item-description">{item.preparation_time} min</div>
                                                <div className="item-price">R$ {item.price.toFixed(2)}</div>
                                            </div>
                                            <div className="item-actions">
                                                <div className="quantity-controls">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                </div>
                                                <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remover</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-summary">
                                    <div className="summary-info">
                                        <div>Total com a entrega</div>
                                        <div className="summary-total">
                                            R$ {totalPrice.toFixed(2)} / {totalItems} {totalItems === 1 ? "item" : "itens"}
                                        </div>
                                    </div>
                                    <button className="checkout-button" onClick={handleContinue}>
                                        Continuar
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}

                {stage === 'address' && (
                    <div className="address-selection">
                        <div className="delivery-type">
                            <button
                                className={tipoEntrega === 'entregar' ? 'selected' : ''}
                                onClick={() => setTipoEntrega('entregar')}
                            >
                                Entregar
                            </button>
                            <button
                                className={tipoEntrega === 'retirar' ? 'selected' : ''}
                                onClick={() => setTipoEntrega('retirar')}
                            >
                                Retirar no local
                            </button>
                        </div>

                        {tipoEntrega === 'entregar' && (
                            <div className="address-list">
                                {enderecos.length === 0 ? (
                                    <p>Nenhum endereço encontrado</p>
                                ) : (
                                    enderecos.map(endereco => (
                                        <div
                                            key={endereco.id}
                                            className={`address-card ${selectedEnderecoId === endereco.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedEnderecoId(endereco.id)}
                                        >
                                            <div className="address-icon">
                                                <FaHome size={20} />
                                            </div>
                                            <div className="address-info">
                                                <div className="address-text">
                                                    {endereco.logradouro}, {endereco.numero}
                                                </div>
                                                <div className="address-text">
                                                    {endereco.bairro}
                                                </div>
                                                <div className="address-text">
                                                    {endereco.cidade}/{endereco.estado}
                                                </div>
                                                <div className="delivery-time">
                                                    Tempo de entrega: {endereco.tempoEntrega} min
                                                </div>
                                            </div>
                                            {selectedEnderecoId === endereco.id && (
                                                <div className="address-selected-icon">
                                                    <FaCheckCircle size={20} />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        <div className="address-actions">
                            <button className="back-button" onClick={handleBack}>
                                Voltar
                            </button>
                            <button
                                className="checkout-button"
                                onClick={() => {
                                    if (tipoEntrega === 'entregar' && !selectedEnderecoId) {
                                        alert('Por favor, selecione um endereço para entrega.');
                                        return;
                                    }
                                    handleContinue();
                                }}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {stage === 'payment' && (
                    <div className="payment-summary">
                        <h3>Forma de Pagamento</h3>
                        <div className="payment-options">
                            {opcoesPagamento.map(opcao => (
                                <div
                                    key={opcao.id}
                                    className={`payment-option ${selectedPagamento === opcao.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedPagamento(opcao.id)}
                                >
                                    {opcao.metodo} ({opcao.tipo_pagamento})
                                </div>
                            ))}
                        </div>

                        <h3>Entrega</h3>
                        {tipoEntrega === 'retirar' ? (
                            <p><strong>Tipo:</strong> Retirada no local</p>
                        ) : (
                            <>
                                <p><strong>Tipo:</strong> Entrega</p>
                                {enderecoSelecionado && (
                                    <div className="address-card selected">
                                        <div className="address-icon">
                                            <FaHome size={20} />
                                        </div>
                                        <div className="address-info">
                                            <div className="address-text">{enderecoSelecionado.logradouro}, {enderecoSelecionado.numero}</div>
                                            <div className="address-text">{enderecoSelecionado.bairro}</div>
                                            <div className="address-text">{enderecoSelecionado.cidade}/{enderecoSelecionado.estado}</div>
                                            <div className="delivery-time">Tempo de entrega: {enderecoSelecionado.tempoEntrega} min</div>
                                        </div>
                                        <div className="address-selected-icon">
                                            <FaCheckCircle size={20} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}


                        <h3>Itens</h3>
                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={item.image_base64.startsWith('data:image') ? item.image_base64 : `data:image/png;base64,${item.image_base64}`}
                                        alt={item.name}
                                        className="item-image"
                                    />
                                    <div className="item-details">
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-description">
                                            {item.description.length > 30
                                                ? item.description.slice(0, 30) + "..."
                                                : item.description}
                                        </div>
                                        <div className="item-description">{item.preparation_time} min</div>
                                        <div className="item-price">R$ {item.price.toFixed(2)}</div>
                                    </div>
                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remover</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3>Total: R$ {totalPrice.toFixed(2)}</h3>

                        <div className="tempo-estimado-box">
                            <div className="tempo-estimado-item">
                                Preparo: <strong>{maxPreparationTime} min</strong>
                            </div>
                            {tipoEntrega === 'entregar' && enderecoSelecionado && (
                                <div className="tempo-estimado-item">
                                    Entrega: <strong>{enderecoSelecionado.tempoEntrega} min</strong>
                                </div>
                            )}
                            <div className="tempo-estimado-item">
                                Previsão entrega: <strong>{tempoTotalEstimado} min</strong>
                            </div>
                        </div>

                        <div className="payment-actions">
                            <button className="back-button" onClick={handleBack}>Voltar</button>
                            <button className="checkout-button" onClick={handleRealizarPedido}>Realizar Pedido</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;