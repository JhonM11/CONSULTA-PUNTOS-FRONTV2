import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Profile from "../components/Profile"
import Ccosto from "../components/Ccosto"
import Zona from "../components/Zona"
import TipoConexion from "../components/TipoConexion"
import Report from "../components/Reports"
import "../styles/home.css"


function Home() {
  const [currentView, setCurrentView] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Cuando se hace clic en un elemento del menú
  const handleMenuClick = (view) => {
    setCurrentView(view)
    if (view === null) {
      // Si view es null, ir a la ruta base de home
      navigate("/home")
    } else {
      // Si hay una vista específica, navegar a ella
      navigate(`/home/${view}`)
    }
  }

  // Leer la URL inicial y actualizar el estado en consecuencia
  useEffect(() => {
    const pathView = location.pathname.split("/")[2] // Ej: 'profile'
    if (pathView) {
      setCurrentView(pathView)
    } else {
      // Si estamos en /home sin vista específica, mostrar vista inicial
      setCurrentView(null)
    }
  }, [location.pathname])

  return (
    <div className="home-container">
      <Header onMenuClick={handleMenuClick} />


      <main className={`home-main-content ${currentView === null ? "default-background" : ""}`}>
        {currentView === "profile" && <Profile />}
        {currentView === "ccosto" && <Ccosto />}
        {currentView === "zonas" && <Zona />}
        {currentView === "conexiones" && <TipoConexion />}
        {currentView === "reportes" && <Report />}
        
        {/* Puedes seguir agregando más vistas así */}
      </main>

      
      <Footer />
    </div>
  )
}

export default Home
