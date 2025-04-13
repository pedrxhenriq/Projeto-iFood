import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';
import background from '../../assets/alimentos-bg.webp';

const API_URL = 'http://localhost:5000/marketplace/';

const Marketplace = () => {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ restaurants: [], products: [] });

  useEffect(() => {
    axios.get(`${API_URL}types`)
      .then(res => setTypes(res.data))
      .catch(err => console.error('Erro ao buscar tipos:', err));
  }, []);

  useEffect(() => {
    if (selectedType) {
      axios.get(`${API_URL}restaurants/by-type`, {
        params: { type: selectedType }
      })
        .then(res => setRestaurants(res.data))
        .catch(err => console.error('Erro ao buscar restaurantes:', err));
    }
  }, [selectedType]);

  const handleSearch = (param = searchQuery) => {
    if (!param.trim()) return;

    setSelectedType(null);
    setRestaurants([]);

    axios.get(`${API_URL}search`, { params: { q: param } })
      .then(res => setSearchResults(res.data))
      .catch(err => console.error('Erro na busca:', err));
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedType(null);
    setRestaurants([]);
  
    setSearchResults({
      restaurants: [restaurant],
      products: restaurant.preview_products || [],
    });
  
    handleSearch(restaurant.name);
  };
  

  return (
    <div className="marketplace-container">
      <div className="marketplace-background">
        <img src={background} alt="Alimentos" />
      </div>

      <div className="marketplace-content">
        <h1 className="marketplace-title">Faça mercado no iFood</h1>
        <p className="marketplace-description">
          Entregamos tudo o que precisa na porta da sua casa, de hortifrúti a itens de limpeza
        </p>

        <div className="marketplace-search-box">
          <input
            type="text"
            placeholder="🔍 Buscar produtos ou restaurantes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => handleSearch()}>Buscar</button>
        </div>

        <div className="marketplace-categories">
          {types.map((item, index) => (
            <span
              key={item.id || index}
              className={`marketplace-category-item ${selectedType === item.name ? 'selected' : ''}`}
              onClick={() => {
                setSelectedType(item.name);
                setSearchQuery('');
                setSearchResults({ restaurants: [], products: [] });
              }}              
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>

      {selectedType && (
        <div className="marketplace-results-section">
          <h3 className="marketplace-results-title">
            Categoria {selectedType}
          </h3>
          <div className="marketplace-results-grid">
            {restaurants.map((rest) => (
              <div key={rest.id} className="restaurant-card-simple" onClick={() => handleRestaurantClick(rest)}>
                <img
                  src={
                    rest.image_base64.startsWith('data:image')
                      ? rest.image_base64
                      : `data:image/png;base64,${rest.image_base64}`
                  }
                  alt={rest.name}
                />
                <p>{rest.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(searchResults.restaurants.length > 0 || searchResults.products.length > 0) && (
        <div className="marketplace-results-section">
          <h3 className="marketplace-results-title">Resultados da busca</h3>

          <div className="marketplace-results-grid">
            {searchResults.products.map((prod) => (
              <div key={`product-${prod.id}`} className="product-card">
                <img
                  src={
                    prod.image_base64.startsWith('data:image')
                      ? prod.image_base64
                      : `data:image/png;base64,${prod.image_base64}`
                  }
                  alt={prod.name}
                />
                <div className="product-price">R$ {prod.price.toFixed(2)}</div>
                <div className="product-name">{prod.name}</div>
                <div className="product-restaurant">
                  <img
                    src={
                      prod.restaurant_image_base64.startsWith('data:image')
                        ? prod.restaurant_image_base64
                        : `data:image/png;base64,${prod.restaurant_image_base64}`
                    }
                    alt={prod.restaurant_name}
                    style={{ width: 35, height: 35, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {prod.restaurant_name}
                </div>

                <div className="delivery-info">
                  {prod.preparation_time} min • <span className="delivery-fee">Grátis</span>
                </div>
              </div>
            ))}

            {searchResults.restaurants.map((rest) => (
              <div key={`restaurant-${rest.id}`} className="restaurant-result-group">
                <div className="restaurant-header">
                  <img
                    src={
                      rest.image_base64.startsWith('data:image')
                        ? rest.image_base64
                        : `data:image/png;base64,${rest.image_base64}`
                    }
                    alt={rest.name}
                  />
                  <div className="restaurant-header-info">
                    <div className="restaurant-name">{rest.name}</div>
                    <div className="restaurant-address">{rest.address}</div>
                  </div>
                </div>

                <div className="marketplace-results-grid">
                  {rest.preview_products?.map((prod) => (
                    <div key={`product-${prod.id}`} className="product-card">
                      <img
                        src={
                          prod.image_base64?.startsWith('data:image')
                            ? prod.image_base64
                            : `data:image/png;base64,${prod.image_base64}`
                        }
                        alt={prod.name}
                      />
                      <div className="product-price">R$ {parseFloat(prod.price).toFixed(2)}</div>
                      <div className="product-name">{prod.name}</div>
                      <div className="product-restaurant">
                        {rest.name}
                      </div>
                      <div className="delivery-info">
                        {prod.preparation_time} min • <span className="delivery-fee">Grátis</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
