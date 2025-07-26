import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { login } from '../services/authService';
import '../styles/login.css';
import backgroundImg from '../assets/background.png';
import Footer from '../components/Footer';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function LoginView() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await login(username, password);
      const payload = parseJwt(token);
      if (payload && payload.role) {
        localStorage.setItem('token', token);
        // Redirección según el rol
        if (payload.role === 'admin') {
          window.location.href = '/admin';
        } else if (payload.role === 'user') {
          window.location.href = '/user';
        } else {
          window.location.href = '/';
        }
      } else {
        setError('Token inválido.');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg" style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Fondo decorativo minimalista */}
        <div className="login-bg-decor" />
      </div>
      <div className="login-form-wrapper">
        <LoginForm onSubmit={handleLogin} error={error} />
        {loading && <div className="login-loading">Cargando...</div>}
      </div>
      <Footer />
    </div>
  );
}

export default LoginView; 