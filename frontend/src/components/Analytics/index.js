import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import {
  Container,
  DateFilter,
  DateFilterTitle,
  DateFilterOptions,
  DateOption,
  CustomDateRange,
  CustomDateInput,
  ApplyDateBtn,
  TabNavigation,
  Tab,
  TabIcon,
  TabContent,
  SearchBar,
  SearchIcon,
  SearchInput,
  Card,
  CardHeader,
  CardTitle,
  CardTitleIcon,
  CardContent,
  DataTable,
  RestaurantName,
  RestaurantLogo,
  Highlight,
  DeliveryTime,
  DeliveryTimeIcon,
  DeliveryBadge,
  ProgressBar,
  ProgressFill,
  ChartContainer,
  LoadingIndicator,
  LoadingSpinner,
  PerformanceCard,
  PerformanceIcon,
  PerformanceContent,
  PerformanceTitle,
  PerformanceText
} from './styles';

const API_BASE_URL = 'http://localhost:5000';

const Relatorio = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [activeDate, setActiveDate] = useState('last30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para dados
  const [topProducts, setTopProducts] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  
  // Refs para os gráficos
  const productsChartRef = React.useRef(null);
  const restaurantsChartRef = React.useRef(null);
  const categoriesChartRef = React.useRef(null);
  const deliveryTimeChartRef = React.useRef(null);
  
  // Instâncias dos gráficos
  const [productsChart, setProductsChart] = useState(null);
  const [restaurantsChart, setRestaurantsChart] = useState(null);
  const [categoriesChart, setCategoriesChart] = useState(null);
  const [deliveryTimeChart, setDeliveryTimeChart] = useState(null);

  // Calcula as datas baseadas na opção selecionada
  const calculateDates = (option) => {
    const today = new Date();
    let start, end;
    
    switch(option) {
      case 'today':
        start = end = today;
        break;
      case 'yesterday':
        start = end = new Date(today.setDate(today.getDate() - 1));
        break;
      case 'last7':
        end = new Date();
        start = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'last30':
        end = new Date();
        start = new Date(today.setDate(today.getDate() - 30));
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'custom':
        return { start: startDate, end: endDate };
      default:
        end = new Date();
        start = new Date(today.setDate(today.getDate() - 30));
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  // Função para buscar dados
  const fetchData = async () => {
    setLoading(true);
    try {
      const dates = calculateDates(activeDate);
      const params = {
        start_date: dates.start,
        end_date: dates.end,
        search: searchTerm
      };

      if (activeTab === 'products') {
        // Busca produtos mais vendidos
        const productsRes = await axios.get(`${API_BASE_URL}/analytics/products/top-selling`, { params });
        setTopProducts(productsRes.data);
        
        // Busca evolução de vendas
        const evolutionRes = await axios.get(`${API_BASE_URL}/analytics/products/sales-evolution`, { params });
        updateProductsChart(evolutionRes.data);
      } else if (activeTab === 'restaurants') {
        // Busca restaurantes top
        const restaurantsRes = await axios.get(`${API_BASE_URL}/analytics/restaurants/top-sales`, { params });
        setTopRestaurants(restaurantsRes.data);
        
        // Busca evolução de vendas
        const evolutionRes = await axios.get(`${API_BASE_URL}/analytics/restaurants/sales-evolution`, { params });
        updateRestaurantsChart(evolutionRes.data);
        
        // Busca distribuição por categoria
        const categoriesRes = await axios.get(`${API_BASE_URL}/analytics/categories/distribution`, { params });
        updateCategoriesChart(categoriesRes.data);
      } else if (activeTab === 'delivery') {
        // Busca tempo médio de entrega
        const deliveryRes = await axios.get(`${API_BASE_URL}/analytics/delivery/average-time`, { params });
        setDeliveryData(deliveryRes.data);
        
        // Busca evolução do tempo de entrega
        const evolutionRes = await axios.get(`${API_BASE_URL}/analytics/delivery/time-evolution`, { params });
        updateDeliveryTimeChart(evolutionRes.data);
        
        // Busca análise de performance
        const performanceRes = await axios.get(`${API_BASE_URL}/analytics/delivery/performance`, { params });
        setPerformanceData(performanceRes.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza gráfico de produtos
  const updateProductsChart = (data) => {
    if (productsChart) {
      productsChart.data = data;
      productsChart.update();
    } else if (productsChartRef.current) {
      const chart = new Chart(productsChartRef.current, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
          },
          scales: {
            x: {
              type: 'category',
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
          }
        }
      });
      setProductsChart(chart);
    }
  };

  // Atualiza gráfico de restaurantes
  const updateRestaurantsChart = (data) => {
    if (restaurantsChart) {
      restaurantsChart.data = data;
      restaurantsChart.update();
    } else if (restaurantsChartRef.current) {
      const chart = new Chart(restaurantsChartRef.current, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false }
            },
            y: {
              stacked: false,
              beginAtZero: true,
              grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
          }
        }
      });
      setRestaurantsChart(chart);
    }
  };

  // Atualiza gráfico de categorias
  const updateCategoriesChart = (data) => {
    if (categoriesChart) {
      categoriesChart.data = data;
      categoriesChart.update();
    } else if (categoriesChartRef.current) {
      const chart = new Chart(categoriesChartRef.current, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12, padding: 20 }
            }
          },
          cutout: '70%'
        }
      });
      setCategoriesChart(chart);
    }
  };

  // Atualiza gráfico de tempo de entrega
  const updateDeliveryTimeChart = (data) => {
    if (deliveryTimeChart) {
      deliveryTimeChart.data = data;
      deliveryTimeChart.update();
    } else if (deliveryTimeChartRef.current) {
      const chart = new Chart(deliveryTimeChartRef.current, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${context.parsed.y} min`
              }
            }
          },
          scales: {
            x: {
              type: 'category',
              grid: { display: false }
            },
            y: {
              min: 15,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: {
                callback: (value) => `${value} min`
              }
            }
          }
        }
      });
      setDeliveryTimeChart(chart);
    }
  };

  // useEffect para buscar dados quando muda tab, data ou search
  useEffect(() => {
    fetchData();
  }, [activeTab, activeDate, searchTerm]);

  // useEffect para cleanup dos gráficos
  useEffect(() => {
    return () => {
      if (productsChart) productsChart.destroy();
      if (restaurantsChart) restaurantsChart.destroy();
      if (categoriesChart) categoriesChart.destroy();
      if (deliveryTimeChart) deliveryTimeChart.destroy();
    };
  }, []);

  const handleDateOptionChange = (option) => {
    setActiveDate(option);
    setShowCustomDate(option === 'custom');
  };

  const handleApplyCustomDate = () => {
    if (startDate && endDate) {
      fetchData();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Container>
      <DateFilter>
        <DateFilterTitle>Período de Análise</DateFilterTitle>
        <DateFilterOptions>
          <DateOption 
            active={activeDate === 'today'} 
            onClick={() => handleDateOptionChange('today')}
          >
            Hoje
          </DateOption>
          <DateOption 
            active={activeDate === 'yesterday'} 
            onClick={() => handleDateOptionChange('yesterday')}
          >
            Ontem
          </DateOption>
          <DateOption 
            active={activeDate === 'last7'} 
            onClick={() => handleDateOptionChange('last7')}
          >
            Últimos 7 dias
          </DateOption>
          <DateOption 
            active={activeDate === 'last30'} 
            onClick={() => handleDateOptionChange('last30')}
          >
            Últimos 30 dias
          </DateOption>
          <DateOption 
            active={activeDate === 'thisMonth'} 
            onClick={() => handleDateOptionChange('thisMonth')}
          >
            Este mês
          </DateOption>
          <DateOption 
            active={activeDate === 'lastMonth'} 
            onClick={() => handleDateOptionChange('lastMonth')}
          >
            Mês passado
          </DateOption>
          <DateOption 
            active={activeDate === 'custom'} 
            onClick={() => handleDateOptionChange('custom')}
          >
            Personalizado
          </DateOption>
        </DateFilterOptions>
        
        {showCustomDate && (
          <CustomDateRange>
            <CustomDateInput>
              <label htmlFor="start-date">Data inicial</label>
              <input 
                type="date" 
                id="start-date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CustomDateInput>
            <CustomDateInput>
              <label htmlFor="end-date">Data final</label>
              <input 
                type="date" 
                id="end-date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CustomDateInput>
            <ApplyDateBtn onClick={handleApplyCustomDate}>Aplicar</ApplyDateBtn>
          </CustomDateRange>
        )}
      </DateFilter>

      <TabNavigation>
        <Tab active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
          <TabIcon>inventory_2</TabIcon>
          Produtos
        </Tab>
        <Tab active={activeTab === 'restaurants'} onClick={() => setActiveTab('restaurants')}>
          <TabIcon>restaurant</TabIcon>
          Restaurantes
        </Tab>
        <Tab active={activeTab === 'delivery'} onClick={() => setActiveTab('delivery')}>
          <TabIcon>delivery_dining</TabIcon>
          Entregas
        </Tab>
      </TabNavigation>

      {/* Tab de Produtos */}
      <TabContent active={activeTab === 'products'}>
        <SearchBar>
          <SearchIcon>search</SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Buscar produto ou restaurante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitleIcon>trending_up</CardTitleIcon>
              Produtos mais vendidos por loja
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingIndicator>
                <LoadingSpinner />
                Carregando dados...
              </LoadingIndicator>
            ) : (
              <DataTable>
                <thead>
                  <tr>
                    <th>Restaurante</th>
                    <th>Produto mais vendido</th>
                    <th>Quantidade</th>
                    <th>% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((item) => (
                    <tr key={`${item.restaurant_id}-${item.product_id}`}>
                      <td>
                        <RestaurantName>
                          <RestaurantLogo>
                            {item.restaurant_logo.startsWith('data:') ? 
                              <img src={item.restaurant_logo} alt="" /> : 
                              item.restaurant_logo
                            }
                          </RestaurantLogo>
                          {item.restaurant_name}
                        </RestaurantName>
                      </td>
                      <td>{item.product_name}</td>
                      <td><Highlight>{item.total_quantity.toLocaleString('pt-BR')}</Highlight></td>
                      <td>{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitleIcon>analytics</CardTitleIcon>
              Evolução de vendas por produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <canvas ref={productsChartRef}></canvas>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabContent>

      {/* Tab de Restaurantes */}
      <TabContent active={activeTab === 'restaurants'}>
        <SearchBar>
          <SearchIcon>search</SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Buscar restaurante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitleIcon>trending_up</CardTitleIcon>
              Restaurantes com maior volume de vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingIndicator>
                <LoadingSpinner />
                Carregando dados...
              </LoadingIndicator>
            ) : (
              <DataTable>
                <thead>
                  <tr>
                    <th>Restaurante</th>
                    <th>Total de Pedidos</th>
                    <th>Pedidos por Dia</th>
                    <th>Receita Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topRestaurants.map((item) => (
                    <tr key={item.restaurant_id}>
                      <td>
                        <RestaurantName>
                          <RestaurantLogo>
                            {item.restaurant_logo.startsWith('data:') ? 
                              <img src={item.restaurant_logo} alt="" /> : 
                              item.restaurant_logo
                            }
                          </RestaurantLogo>
                          {item.restaurant_name}
                        </RestaurantName>
                      </td>
                      <td><Highlight>{item.total_orders.toLocaleString('pt-BR')}</Highlight></td>
                      <td>{item.orders_per_day}</td>
                      <td>{formatCurrency(item.total_revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitleIcon>bar_chart</CardTitleIcon>
              Evolução do volume de vendas por restaurante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <canvas ref={restaurantsChartRef}></canvas>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitleIcon>pie_chart</CardTitleIcon>
              Distribuição de vendas por categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer style={{ height: '250px' }}>
              <canvas ref={categoriesChartRef}></canvas>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabContent>

      {/* Tab de Entregas */}
      <TabContent active={activeTab === 'delivery'}>
        <SearchBar>
          <SearchIcon>search</SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Buscar restaurante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitleIcon>schedule</CardTitleIcon>
              Tempo médio de entrega por restaurante
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingIndicator>
                <LoadingSpinner />
                Carregando dados...
              </LoadingIndicator>
            ) : (
              <DataTable>
                <thead>
                  <tr>
                    <th>Restaurante</th>
                    <th>Tempo médio</th>
                    <th>Entregas no prazo</th>
                    <th>Tipo de entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryData.map((item) => (
                    <tr key={item.restaurant_id}>
                      <td>
                        <RestaurantName>
                          <RestaurantLogo>
                            {item.restaurant_logo.startsWith('data:') ? 
                              <img src={item.restaurant_logo} alt="" /> : 
                              item.restaurant_logo
                            }
                          </RestaurantLogo>
                          {item.restaurant_name}
                        </RestaurantName>
                      </td>
                      <td>
                        <DeliveryTime>
                          <DeliveryTimeIcon>schedule</DeliveryTimeIcon>
                          {item.avg_delivery_time} min
                        </DeliveryTime>
                      </td>
                      <td>
                        <div>
                          <DeliveryBadge className={item.badge_class}>
                            {item.on_time_percentage}%
                          </DeliveryBadge>
                          <ProgressBar>
                            <ProgressFill 
                              width={item.on_time_percentage} 
                              className={item.badge_class}
                            />
                          </ProgressBar>
                        </div>
                      </td>
                      <td>
                        <DeliveryBadge className="neutral">
                          {item.delivery_type}
                        </DeliveryBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitleIcon>timeline</CardTitleIcon>
              Evolução do tempo médio de entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <canvas ref={deliveryTimeChartRef}></canvas>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitleIcon>insights</CardTitleIcon>
              Análise de desempenho de entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingIndicator>
                <LoadingSpinner />
                Carregando dados...
              </LoadingIndicator>
            ) : performanceData && (
              <div>
                {performanceData.best_performer && (
                  <PerformanceCard>
                    <PerformanceIcon className="success">trending_up</PerformanceIcon>
                    <PerformanceContent>
                      <PerformanceTitle>Melhor desempenho</PerformanceTitle>
                      <PerformanceText>
                        {performanceData.best_performer.restaurant} reduziu seu tempo médio de entrega em {Math.abs(performanceData.best_performer.improvement).toFixed(1)}% no último período.
                      </PerformanceText>
                    </PerformanceContent>
                  </PerformanceCard>
                )}
                
                {performanceData.attention_needed && (
                  <PerformanceCard>
                    <PerformanceIcon className="warning">warning</PerformanceIcon>
                    <PerformanceContent>
                      <PerformanceTitle>Atenção necessária</PerformanceTitle>
                      <PerformanceText>
                        {performanceData.attention_needed.restaurant} está com taxa de entrega no prazo abaixo da meta ({performanceData.attention_needed.on_time_percentage}% vs 85%).
                      </PerformanceText>
                    </PerformanceContent>
                  </PerformanceCard>
                )}
                
                {performanceData.worst_performer && (
                  <PerformanceCard>
                    <PerformanceIcon className="danger">trending_down</PerformanceIcon>
                    <PerformanceContent>
                      <PerformanceTitle>Pior desempenho</PerformanceTitle>
                      <PerformanceText>
                        {performanceData.worst_performer.restaurant} aumentou seu tempo médio de entrega em {Math.abs(performanceData.worst_performer.improvement).toFixed(1)}% no último período.
                      </PerformanceText>
                    </PerformanceContent>
                  </PerformanceCard>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabContent>
    </Container>
  );
};

export default Relatorio;