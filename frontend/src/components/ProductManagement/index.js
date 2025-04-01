import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from '../ProductForm/index.js';
import ProductList from '../ProductList/index.js';
import './index.css';

const ProductManagement = () => {
    const [view, setView] = useState('list');
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        preparation_time: '',
        price: '',
        restaurant_id: ''
    });
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingId, setEditingId] = useState(null);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`/products?page=${page}`);
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const { data } = await axios.get('/restaurants');
            setRestaurants(data.restaurants || []);
        } catch (error) {
            console.error('Erro ao buscar restaurantes:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchRestaurants();
    }, [page]);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            preparation_time: '',
            price: '',
            restaurant_id: ''
        });
        setEditingId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await axios.put(`/products/${editingId}`, formData);
            } else {
                await axios.post('/products', formData);
            }
            fetchProducts();
            resetForm();
            setView('list');
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            preparation_time: product.preparation_time,
            price: product.price,
            restaurant_id: product.restaurant_id
        });
        setEditingId(product.id);
        setView('update');
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    };

    const handlePageChange = (newPage) => setPage(newPage);

    return (
        <div className="product-management">
            <h2>Gestão de Produtos</h2>
            <div className="product-actions">
                <button onClick={() => setView('list')}>Listar</button>
                <button onClick={() => { resetForm(); setView('create'); }}>Cadastrar</button>
            </div>
            <div className="product-content">
                {view === 'list' && (
                    <ProductList
                        products={products}
                        onEdit={handleEdit}
                        onDelete={handleDeleteProduct}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
                {(view === 'create' || view === 'update') && (
                    <ProductForm
                        mode={view}
                        formData={formData}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        restaurants={restaurants}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductManagement;