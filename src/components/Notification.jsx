"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa"
import "../styles/notification.css"

function Notification({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, 1600)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  let icon
  // Establecer los iconos según el tipo de notificación
  if (type === "success") {
    icon = <FaCheckCircle size={24} />
  } else if (type === "error") {
    icon = <FaTimesCircle size={24} />
  } else if (type === "warning") {
    icon = <FaExclamationCircle size={24} />
  }

  const notificationContent = (
    <div className={`notification-globo ${type}`}>
      <div className="notification-content">
        {icon}
        <span>{message}</span>
      </div>
      <button className="notification-close" onClick={onClose} aria-label="Cerrar notificación">
        ×
      </button>
    </div>
  )

  // Usar createPortal para renderizar la notificación en el body
  return createPortal(notificationContent, document.body)
}

export default Notification
