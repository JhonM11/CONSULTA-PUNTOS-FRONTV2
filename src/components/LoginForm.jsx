import React, { useState } from 'react';

function LoginForm({ onSubmit, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
      <h2 className="login-title">Iniciar sesión</h2>
      <label className="login-label">
        <input
          className="login-input"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          placeholder=" "
          autoComplete="username"
        />
        <span className="floating-label">Usuario</span>
      </label>
      <label className="login-label" style={{ position: 'relative' }}>
        <input
          className="login-input"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder=" "
          autoComplete="current-password"
        />
        <span className="floating-label">Contraseña</span>
        <button
          type="button"
          tabIndex={-1}
          className="password-eye-btn"
          onClick={() => setShowPassword(v => !v)}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#387ADB',
            fontSize: '1.25rem',
            zIndex: 2
          }}
        >
          {showPassword ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22" /><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.74-1.32 2.1-3.36 4.06-5.06M9.5 9.5a3 3 0 0 1 4.5 4.5" /><path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" /><path d="M9.88 9.88L4.06 4.06M14.12 14.12l5.82 5.82" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="10" ry="7" /><circle cx="12" cy="12" r="3" /></svg>
          )}
        </button>
      </label>
      {error && <div className="login-error">{error}</div>}
      <button className="login-button" type="submit">Iniciar sesión</button>
    </form>
  );
}

export default LoginForm; 