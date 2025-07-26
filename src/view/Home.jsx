import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/login.css';

function Home() {
  return (
    <div className="home-container">
      <Header />
      <main className="home-main-content">
        {/* Aquí puedes agregar contenido principal */}
      </main>
      <Footer />
    </div>
  );
}

export default Home; 