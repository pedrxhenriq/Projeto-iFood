import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from '../ProductForm/index.js';
import ProductList from '../ProductList/index.js';
import './index.css';

const API_URL = 'http://localhost:5000/products/';

const ProductManagement = () => {
    const [view, setView] = useState('list');
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        preparation_time: '',
        price: '',
        restaurant_id: '',
        image_base64: ''
    });
    const [restaurants, setRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingId, setEditingId] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL, { params: { page, per_page: 5 } });
            setProducts(response.data.products);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error('Erro ao buscar produtos', error);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/restaurants`);
            setRestaurants(data || []);
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
            restaurant_id: '',
            image_base64: ''
        });
        setEditingId(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    image_base64: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await axios.put(`${API_URL}${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}`, formData);
            }
            fetchProducts();
            resetForm();
            setView('list');
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
        }
    };

    const handleEdit = (product) => {
        setFormData(product);
        setEditingId(product.id);
        setView('update');
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${API_URL}${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    };

    const handleReactivateProduct = async (id) => {
        try {
            await axios.post(`${API_URL}${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Erro ao reativar produto', error);
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
                        onReactivate={handleReactivateProduct}
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
                        onImageChange={handleImageChange}
                        onSubmit={handleSubmit}
                        restaurants={restaurants}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductManagement;