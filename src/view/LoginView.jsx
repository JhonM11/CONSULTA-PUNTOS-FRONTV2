import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login } from '../services/authService';
import '../styles/login.css';
import backgroundImg from '../assets/background.png';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthContext';
import Notification from '../components/Notification';

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
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await login(username, password);
      const payload = parseJwt(token);
      if (payload && payload.role) {
        loginContext(token, payload.role);
        navigate('/success', { replace: true });
      } else {
        setError('Token inválido.');
      }
    } catch (e) {
      if (e.message === 'Failed to fetch') {
        setError('El servicio no está actualmente disponible');
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => setError(null);

  return (
    <div className="login-container">
      <Notification message={error} onClose={handleCloseNotification} />
      <div className="login-bg" style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="login-bg-decor" />
      </div>
      <div className="login-form-wrapper" style={{ position: 'relative' }}>
        <LoginForm onSubmit={handleLogin} error={null} />
        {loading && (
          <div className="login-spinner-overlay">
            <div className="login-spinner">
              <div className="login-spinner-circle" />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LoginView; 