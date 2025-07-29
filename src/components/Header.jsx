import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserSession } from '../services/userService';
import { FiSettings, FiMenu } from 'react-icons/fi';
import '../styles/home.css';

const NAV_OPTIONS = {
  ADMIN: [
    { label: 'PUNTOS' },
    { label: 'USUARIOS' },
    { label: 'CONEXIONES' },
    { label: 'ZONAS' },
    { label: 'CENTROS DE COSTO' },
    { label: 'REPORTES' },
    { label: 'CARGA DE ARCHIVOS' },
  ],
  COORDINADOR: [
    { label: 'PUNTOS' },
    { label: 'USUARIOS' },
    { label: 'CONEXIONES' },
    { label: 'ZONAS' },
    { label: 'CENTROS DE COSTO' },
  ],
  AUXILIAR: [
    { label: 'PUNTOS' },
  ],
};

// Mapeo de etiqueta a ruta interna
const mapLabelToView = (label) => {
  switch (label) {
    case 'PUNTOS': return 'puntos';
    case 'USUARIOS': return 'usuarios';
    case 'CONEXIONES': return 'conexiones';
    case 'ZONAS': return 'zonas';
    case 'CENTROS DE COSTO': return 'ccosto';
    case 'REPORTES': return 'reportes';
    case 'CARGA DE ARCHIVOS': return 'carga-archivos';
    default: return null;
  }
};

function Header({ onMenuClick }) {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserSession(token);
        setUser(data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
      }
    }
    if (token) fetchUser();
  }, [token]);

  const navOptions = user && NAV_OPTIONS[user.role] ? NAV_OPTIONS[user.role] : [];
  const userLabel = user ? `${user.name.toUpperCase()} ${user.lastname.toUpperCase()}` : '';

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    logout();
  };

  const handleProfileClick = () => {
    onMenuClick('profile');
    setAsideOpen(false);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('authToken');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
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
          <nav className="aside-nav" onClick={(e) => e.stopPropagation()}>
            <button className="aside-close" onClick={() => setAsideOpen(false)} aria-label="Cerrar menú">×</button>
            <ul>
              {navOptions.map(opt => {
                const view = mapLabelToView(opt.label);
                return (
                  <li key={opt.label}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (view) {
                          onMenuClick(view);
                          setAsideOpen(false);
                        }
                      }}
                    >
                      {opt.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      )}
    </header>
  );
}

export default Header;
