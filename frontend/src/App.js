import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/index.js';
import Marketplace from './components/Marketplace/index.js';
import UserManagement from './components/UserManagement/index.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
