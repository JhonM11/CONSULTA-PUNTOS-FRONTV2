import React, { useEffect } from 'react';
import '../styles/login.css';

function Notification({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 1600);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="notification-globo">
      {message}
      <button className="notification-close" onClick={onClose} aria-label="Cerrar notificación">×</button>
    </div>
  );
}

export default Notification; 