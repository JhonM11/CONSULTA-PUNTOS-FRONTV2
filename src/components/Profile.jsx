import React, { useEffect, useState } from 'react';
import { getUserSession, changePassword } from '../services/userService'; // Importar el servicio
import Notification from '../components/Notification';
import '../styles/profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [loading, setLoading] = useState(false);  // Nuevo estado para manejar la carga

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      getUserSession(token)
        .then((data) => setUserData(data))
        .catch((error) => console.error('Error al obtener los datos del usuario:', error));
    }
  }, []);

  const handlePasswordChange = async () => {
    setLoading(true);  // Establecer loading en true antes de realizar la solicitud
    const token = sessionStorage.getItem('token');
    const codeuser = userData.codeuser;  // Obtener el codeuser de los datos del usuario

    try {
      console.log('Iniciando cambio de contraseña con los siguientes datos:', {
        codeuser,
        currentPassword,
        newPassword,
        token
      });

      // Llamar al servicio changePassword con los parámetros adecuados
      const response = await changePassword(codeuser, currentPassword, newPassword, token);
      
      // Si la respuesta contiene el atributo "message", es un éxito
      if (response.message) {
        setNotificationMessage(response.message);  // El mensaje de éxito
        setNotificationType('success'); // Tipo de notificación exitosa (verde)
        setIsPasswordModalOpen(false);  // Cerrar el modal después de guardar
        setCurrentPassword('');  // Limpiar el campo de contraseña actual
        setNewPassword('');  // Limpiar el campo de nueva contraseña
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);

      // Si el error tiene el atributo "error", se maneja como una advertencia (amarillo)
      if (error.message) {
        setNotificationMessage(error.message);  // Muestra el error del servidor
        setNotificationType('warning'); // Tipo de notificación de advertencia (amarillo)
      } else {
        setNotificationMessage('Error al cambiar la contraseña');
        setNotificationType('error'); // Tipo de notificación de error (rojo)
      }
    } finally {
      setLoading(false);  // Establecer loading en false después de completar la solicitud
    }
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);  // Cerrar el modal sin hacer cambios
    setCurrentPassword('');  // Limpiar el campo de contraseña actual
    setNewPassword('');  // Limpiar el campo de nueva contraseña
  };

  if (!userData) {
    return (
      <div className="loading-container">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Perfil de Usuario</h2>
      <div className="profile-details">
        <div className="profile-item">
          <label>Nombre:</label>
          <input type="text" value={userData.name} disabled />
        </div>
        <div className="profile-item">
          <label>Apellido:</label>
          <input type="text" value={userData.lastname} disabled />
        </div>
        <div className="profile-item">
          <label>Email:</label>
          <input type="email" value={userData.mail} disabled />
        </div>
        <div className="profile-item">
          <label>Username:</label>
          <input type="text" value={userData.username} disabled />
        </div>
        <div className="profile-item">
          <label>Código de Usuario:</label>
          <input type="text" value={userData.codeuser} disabled />
        </div>
        <div className="profile-item">
          <label>Rol:</label>
          <input type="text" value={userData.role} disabled />
        </div>
      </div>

      {/* Botón para cambiar la contraseña */}
      <button
        className="change-password-btn"
        onClick={() => setIsPasswordModalOpen(true)}
      >
        Cambiar contraseña
      </button>

      {/* Modal de cambio de contraseña */}
      {isPasswordModalOpen && (
        <div className="password-modal">
          <div className="password-modal-content">
            <button
              className="close-modal-btn"
              onClick={closePasswordModal}
            >
              ×
            </button>
            <h3>Cambiar Contraseña</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                className="save-password-btn"
                onClick={handlePasswordChange}
                disabled={loading} // Deshabilitar el botón mientras se está realizando la solicitud
              >
                {loading ? 'Cargando...' : 'Guardar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notificación de éxito o error */}
      <Notification
        message={notificationMessage}
        type={notificationType}  // Pasamos el tipo de notificación
        onClose={() => setNotificationMessage('')}
      />
    </div>
  );
};

export default Profile;
