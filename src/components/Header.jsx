import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';  // Asegúrate de que useAuth maneje el estado de autenticación
import { getUserSession } from '../services/userService';
import { FiSettings, FiMenu } from 'react-icons/fi';
import '../styles/home.css';

const PALE_GRAY = '#f4f6fa';

// Definimos las opciones de navegación para cada rol
const NAV_OPTIONS = {
  ADMIN: [
    { label: 'PUNTOS', href: '#' },
    { label: 'USUARIOS', href: '#' },
    { label: 'CONEXIONES', href: '#' },
    { label: 'ZONAS', href: '#' },
    { label: 'CENTROS DE COSTO', href: '#' },
    { label: 'REPORTES', href: '#' },
    { label: 'CARGA DE ARCHIVOS', href: '#' },
  ],
  COORDINADOR: [
    { label: 'PUNTOS', href: '#' },
    { label: 'USUARIOS', href: '#' },
    { label: 'CONEXIONES', href: '#' },
    { label: 'ZONAS', href: '#' },
    { label: 'CENTROS DE COSTO', href: '#' },
  ],
  AUXILIAR: [
    { label: 'PUNTOS', href: '#' },
  ],
};

function Header({ onMenuClick }) {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);

  // Fetch de datos del usuario y guardarlos en el estado
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserSession(token);
        console.log("Datos del usuario:", data);
        setUser(data);  // Guardamos los datos del usuario
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
      }
    }
    if (token) fetchUser();
  }, [token]);

  // Obtenemos las opciones del menú según el rol del usuario
  const navOptions = user && NAV_OPTIONS[user.role] ? NAV_OPTIONS[user.role] : [];
  const userLabel = user ? `${user.name.toUpperCase()} ${user.lastname.toUpperCase()}` : '';

  // Función para cerrar sesión
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');  // O localStorage.removeItem('authToken')
    logout();  // Llama a la función logout que actualiza el contexto
  };

  // Función que maneja el clic en la opción "Perfil"
  const handleProfileClick = () => {
    onMenuClick('profile');  // Llamamos a onMenuClick con 'profile' para cargar el componente Profile
    setAsideOpen(false);  // Cerramos el menú al hacer clic en perfil
    setDropdownOpen(false); // Cierra el dropdown del engranaje
  };

  // Cerrar sesión cuando la ventana/pestaña se cierra
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('authToken');  // O localStorage.removeItem('authToken')
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <header className="home-header">
      <div className="header-left">
        <div className="header-icon-wrapper">
          <button
            className="header-icon-btn"
            onClick={() => setAsideOpen(true)}
            aria-label="Abrir menú"
          >
            <FiMenu size={26} color="#387ADB" />
          </button>
        </div>
      </div>
      <div className="header-right">
        {user && <span className="header-user-label">{userLabel}</span>}
        <div className="header-icon-group">
          <div className="header-icon-wrapper">
            <button
              className="header-icon-btn"
              onClick={() => setDropdownOpen(v => !v)}
              aria-label="Opciones de usuario"
            >
              <FiSettings size={22} color="#387ADB" />
            </button>
            {dropdownOpen && (
              <div className="header-dropdown">
                <a href="#" className="header-dropdown-link" onClick={handleProfileClick}>
                  Perfil
                </a>
                <button className="header-dropdown-link" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {asideOpen && (
        <aside className="header-aside" onClick={() => setAsideOpen(false)}>
          <nav className="aside-nav" onClick={e => e.stopPropagation()}>
            <button className="aside-close" onClick={() => setAsideOpen(false)} aria-label="Cerrar menú">×</button>
            <ul>
              {navOptions.map(opt => (
                <li key={opt.label}><a href={opt.href}>{opt.label}</a></li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
    </header>
  );
}

export default Header;
