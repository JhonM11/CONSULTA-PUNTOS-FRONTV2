"use client"

import { useEffect, useState } from "react"
import { getUserSession, changePassword } from "../services/userService"
import { FiUser, FiLock, FiX, FiSave } from "react-icons/fi"
import Notification from "../components/Notification"
import '../styles/profile.css';

const Profile = () => {
  // Estados para los datos del usuario y la funcionalidad
  const [userData, setUserData] = useState(null)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("")
  const [loading, setLoading] = useState(false)

  // Efecto para cargar los datos del usuario al montar el componente
  useEffect(() => {
    const token = sessionStorage.getItem("token")
    if (token) {
      getUserSession(token)
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error al obtener los datos del usuario:", error))
    }
  }, [])

  // Función para manejar el cambio de contraseña
  const handlePasswordChange = async () => {
    setLoading(true)
    const token = sessionStorage.getItem("token")
    const codeuser = userData.codeuser

    try {
      console.log("Iniciando cambio de contraseña con los siguientes datos:", {
        codeuser,
        currentPassword,
        newPassword,
        token,
      })

      // Llamar al servicio changePassword con los parámetros adecuados
      const response = await changePassword(codeuser, currentPassword, newPassword, token)

      // Si la respuesta contiene el atributo "message", es un éxito
      if (response.message) {
        setNotificationMessage(response.message)
        setNotificationType("success")
        setIsPasswordModalOpen(false)
        setCurrentPassword("")
        setNewPassword("")
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error)
      // Manejo de errores con diferentes tipos de notificación
      if (error.message) {
        setNotificationMessage(error.message)
        setNotificationType("warning")
      } else {
        setNotificationMessage("Error al cambiar la contraseña")
        setNotificationType("error")
      }
    } finally {
      setLoading(false)
    }
  }

  // Función para cerrar el modal de cambio de contraseña
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false)
    setCurrentPassword("")
    setNewPassword("")
  }

  // Función para mostrar notificaciones
  const showNotification = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
  }

  // Función para cerrar notificaciones
  const closeNotification = () => {
    setNotificationMessage("")
    setNotificationType("")
  }

  // Pantalla de carga mientras se obtienen los datos
  if (!userData) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <span>Cargando perfil...</span>
      </div>
    )
  }

  return (
    <>
      <div className="profile-container">
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="profile-header-content">
            <FiUser className="profile-header-icon" />
            <h2>Perfil de Usuario</h2>
          </div>
        </div>

        {/* Tarjeta con los detalles del usuario */}
        <div className="profile-card">
          <div className="profile-details">
            {/* Primera fila de campos */}
            <div className="profile-row">
              <div className="profile-field">
                <label className="profile-label">Nombre</label>
                <input type="text" value={userData.name} disabled className="profile-input" />
              </div>
              <div className="profile-field">
                <label className="profile-label">Apellido</label>
                <input type="text" value={userData.lastname} disabled className="profile-input" />
              </div>
            </div>

            {/* Segunda fila de campos */}
            <div className="profile-row">
              <div className="profile-field">
                <label className="profile-label">Email</label>
                <input type="email" value={userData.mail} disabled className="profile-input" />
              </div>
              <div className="profile-field">
                <label className="profile-label">Username</label>
                <input type="text" value={userData.username} disabled className="profile-input" />
              </div>
            </div>

            {/* Tercera fila de campos */}
            <div className="profile-row">
              <div className="profile-field">
                <label className="profile-label">Código de Usuario</label>
                <input type="text" value={userData.codeuser} disabled className="profile-input" />
              </div>
              <div className="profile-field">
                <label className="profile-label">Rol</label>
                <input type="text" value={userData.role} disabled className="profile-input" />
              </div>
            </div>
          </div>

          {/* Botón para cambiar contraseña */}
          <div className="profile-actions">
            <button className="profile-change-password-btn" onClick={() => setIsPasswordModalOpen(true)}>
              <FiLock />
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {/* Modal para cambio de contraseña */}
        {isPasswordModalOpen && (
          <div className="profile-modal-overlay">
            <div className="profile-modal">
              <div className="profile-modal-header">
                <span>Cambiar Contraseña</span>
                <button className="profile-modal-close-btn" onClick={closePasswordModal}>
                  <FiX />
                </button>
              </div>
              <div className="profile-modal-body">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="profile-modal-field">
                    <label className="profile-modal-label">Contraseña Actual</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="profile-modal-input"
                      placeholder="Ingresa tu contraseña actual"
                      required
                    />
                  </div>
                  <div className="profile-modal-field">
                    <label className="profile-modal-label">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="profile-modal-input"
                      placeholder="Ingresa tu nueva contraseña"
                      required
                    />
                  </div>
                  <div className="profile-modal-actions">
                    <button type="button" className="profile-modal-cancel-btn" onClick={closePasswordModal}>
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="profile-modal-save-btn"
                      onClick={handlePasswordChange}
                      disabled={loading}
                    >
                      <FiSave />
                      {loading ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Componente de notificación */}
      <Notification message={notificationMessage} type={notificationType} onClose={closeNotification} />
    </>
  )
}

export default Profile
