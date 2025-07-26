import React, { useState } from 'react';

function LoginForm({ onSubmit, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">Iniciar sesión</h2>
      <label className="login-label">
        Usuario
        <input
          className="login-input"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </label>
      <label className="login-label">
        Contraseña
        <input
          className="login-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <div className="login-error">{error}</div>}
      <button className="login-button" type="submit">Iniciar sesión</button>
    </form>
  );
}

export default LoginForm; 