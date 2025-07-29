import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import '../styles/home.css';

function Home() {
  const [currentView, setCurrentView] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Cuando se hace clic en un elemento del menú
  const handleMenuClick = (view) => {
    setCurrentView(view);
    navigate(`/home/${view}`); // Actualiza la URI del navegador
  };

  // Leer la URL inicial y actualizar el estado en consecuencia
  useEffect(() => {
    const pathView = location.pathname.split('/')[2]; // Ej: 'profile'
    if (pathView) {
      setCurrentView(pathView);
    }
  }, [location.pathname]);

  return (
    <div className="home-container">
      <Header onMenuClick={handleMenuClick} />
      <main className={`home-main-content ${currentView === null ? 'default-background' : ''}`}>
        {currentView === 'profile' && <Profile />}
        {/* Puedes seguir agregando más vistas así */}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
