import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserSession } from '../services/userService';
import { FiSettings, FiMenu } from 'react-icons/fi';
import '../styles/home.css';

const PALE_GRAY = '#f4f6fa';

function capitalize(str) {
  return str ? str.toUpperCase() : '';
}

const NAV_OPTIONS = {
  ADMIN: [
    { label: 'Dashboard', href: '#' },
    { label: 'Usuarios', href: '#' },
    { label: 'Reportes', href: '#' },
  ],
  USER: [
    { label: 'Inicio', href: '#' },
    { label: 'Mi Perfil', href: '#' },
  ],
};

function Header() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserSession(token);
        setUser(data);
      } catch {}
    }
    if (token) fetchUser();
  }, [token]);

  const navOptions = user && NAV_OPTIONS[user.role] ? NAV_OPTIONS[user.role] : [];
  const userLabel = user ? `${capitalize(user.name)} ${capitalize(user.lastname)}` : '';

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
                <a href="#" className="header-dropdown-link">Perfil</a>
                <button className="header-dropdown-link" onClick={logout}>Cerrar sesión</button>
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