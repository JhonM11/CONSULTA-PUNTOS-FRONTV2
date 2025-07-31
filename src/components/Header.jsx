import { useState, useEffect, useRef } from "react"
import { useAuth } from "./AuthContext"
import { getUserSession } from "../services/userService"
import { FiSettings, FiMenu, FiHome, FiUser, FiLogOut } from "react-icons/fi"
import "../styles/home.css"

const NAV_OPTIONS = {
  ADMIN: [
    { label: "PUNTOS" },
    { label: "USUARIOS" },
    { label: "CONEXIONES" },
    { label: "ZONAS" },
    { label: "CENTROS DE COSTO" },
    { label: "REPORTES" },
    { label: "CARGA DE ARCHIVOS" },
  ],
  COORDINADOR: [
    { label: "PUNTOS" },
    { label: "USUARIOS" },
    { label: "CONEXIONES" },
    { label: "ZONAS" },
    { label: "CENTROS DE COSTO" },
  ],
  AUXILIAR: [{ label: "PUNTOS" }],
}

// Mapeo de etiqueta a ruta interna
const mapLabelToView = (label) => {
  switch (label) {
    case "PUNTOS":
      return "puntos"
    case "USUARIOS":
      return "usuarios"
    case "CONEXIONES":
      return "conexiones"
    case "ZONAS":
      return "zonas"
    case "CENTROS DE COSTO":
      return "ccosto"
    case "REPORTES":
      return "reportes"
    case "CARGA DE ARCHIVOS":
      return "LoadFile"
    default:
      return null
  }
}

function Header({ onMenuClick }) {
  const { token, logout } = useAuth()
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [asideOpen, setAsideOpen] = useState(false)

  // Ref para el dropdown para detectar clicks fuera
  const dropdownRef = useRef(null)

  // Efecto para obtener datos del usuario
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserSession(token)
        setUser(data)
      } catch (error) {
        console.error("Error al obtener los datos del usuario", error)
      }
    }
    if (token) fetchUser()
  }, [token])

  // Efecto para cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    // Solo agregar el listener si el dropdown está abierto
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Cleanup del event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  // Efecto para limpiar token al cerrar ventana
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("authToken")
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  const navOptions = user && NAV_OPTIONS[user.role] ? NAV_OPTIONS[user.role] : []
  const userLabel = user ? `${user.name.toUpperCase()} ${user.lastname.toUpperCase()}` : ""

  // Función para manejar logout
  const handleLogout = () => {
    sessionStorage.removeItem("authToken")
    logout()
  }

  // Función para ir al perfil
  const handleProfileClick = () => {
    onMenuClick("profile")
    setAsideOpen(false)
    setDropdownOpen(false)
  }

  // Función para ir a la vista inicial (home)
  const handleHomeClick = () => {
    onMenuClick(null) // null significa vista inicial sin componente específico
    setAsideOpen(false)
    setDropdownOpen(false)
  }

  return (
    <header className="home-header">
      <div className="header-left">
        <div className="header-icon-wrapper">
          <button className="header-icon-btn" onClick={() => setAsideOpen(true)} aria-label="Abrir menú">
            <FiMenu size={26} color="#387ADB" />
          </button>
        </div>
        {/* Icono de casa agregado */}
        <div className="header-icon-wrapper">
          <button className="header-icon-btn" onClick={handleHomeClick} aria-label="Ir al inicio">
            <FiHome size={24} color="#387ADB" />
          </button>
        </div>
      </div>

      <div className="header-right">
        {user && <span className="header-user-label">{userLabel}</span>}
        <div className="header-icon-group">
          <div className="header-icon-wrapper" ref={dropdownRef}>
            <button
              className="header-icon-btn"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="Opciones de usuario"
            >
              <FiSettings size={22} color="#387ADB" />
            </button>
            {dropdownOpen && (
              <div className="header-dropdown">
                <a href="#" className="header-dropdown-link" onClick={handleProfileClick}>
                  <FiUser size={16} />
                  <span>Perfil</span>
                </a>
                <button className="header-dropdown-link" onClick={handleLogout}>
                  <FiLogOut size={16} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {asideOpen && (
        <aside className="header-aside" onClick={() => setAsideOpen(false)}>
          <nav className="aside-nav" onClick={(e) => e.stopPropagation()}>
            <button className="aside-close" onClick={() => setAsideOpen(false)} aria-label="Cerrar menú">
              ×
            </button>
            <ul>
              {navOptions.map((opt) => {
                const view = mapLabelToView(opt.label)
                return (
                  <li key={opt.label}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (view) {
                          onMenuClick(view)
                          setAsideOpen(false)
                        }
                      }}
                    >
                      {opt.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
      )}
    </header>
  )
}

export default Header
