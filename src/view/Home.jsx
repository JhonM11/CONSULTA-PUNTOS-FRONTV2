import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';  // Importamos el componente Profile
import '../styles/home.css';

function Home() {
  const [currentView, setCurrentView] = useState(null);  // Estado para gestionar la vista actual

  // Función que maneja el cambio de vista
  const handleMenuClick = (view) => {
    setCurrentView(view);  // Actualizamos el estado para cambiar la vista
  };

  return (
    <div className="home-container">
      <Header onMenuClick={handleMenuClick} />  {/* Pasamos la función de cambio de vista */}
      <main className={`home-main-content ${currentView === null ? 'default-background' : ''}`}>
        {currentView === 'profile' && <Profile />}  {/* Cargamos el componente Profile cuando se selecciona "Perfil" */}
        {/* Agregar más condiciones aquí para otros componentes según se haga clic */}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
