import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa'; // Iconos para éxito, error y advertencia
import '../styles/notification.css'; // Asegúrate de tener los estilos necesarios

function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 1600);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  let icon, color;

  // Establecer los iconos y colores según el tipo de notificación
  if (type === 'success') {
    icon = <FaCheckCircle size={24} />;
    color = '#28a745';  // Verde para éxito
  } else if (type === 'error') {
    icon = <FaTimesCircle size={24} />;
    color = '#dc3545';  // Rojo para error
  } else if (type === 'warning') {
    icon = <FaExclamationCircle size={24} />;
    color = '#ffc107';  // Amarillo para advertencia
  }

  return (
    <div className="notification-globo" style={{ backgroundColor: color }}>
      <div className="notification-content">
        {icon}
        <span>{message}</span>
      </div>
      <button className="notification-close" onClick={onClose} aria-label="Cerrar notificación">×</button>
    </div>
  );
}

export default Notification;
