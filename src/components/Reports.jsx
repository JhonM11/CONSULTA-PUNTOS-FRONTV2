import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { FiFileText, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { getAllTipoConexiones } from "../services/tipoconexionesService"
import { getAllZonas } from "../services/zonaServices"
import { getAllCcosto } from "../services/ccostoService"
import { getReportExcel } from "../services/reportesService"
import Notification from "./Notification"
import ReportExcel from "./ReportExcel"
import ReportFormatAnsible from "./ReportFormatAnsible"
import "../styles/reports.css"

function Reports() {
  const { token } = useAuth()

  // Estados para los datos de cada contenedor
  const [zonas, setZonas] = useState([])
  const [centrosCosto, setCentrosCosto] = useState([])
  const [tipoConexiones, setTipoConexiones] = useState([])

  // Estados para controlar qué elementos están activos
  const [activeZonas, setActiveZonas] = useState([])
  const [activeCentrosCosto, setActiveCentrosCosto] = useState([])
  const [activeTipoConexiones, setActiveTipoConexiones] = useState([])

  // Estado para el filtro global
  const [globalNoFilter, setGlobalNoFilter] = useState(true)

  // Estados para notificaciones y loading
  const [notification, setNotification] = useState({ message: "", type: "" })
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)

  // Estado para controlar qué acordeón está abierto
  const [activeAccordion, setActiveAccordion] = useState(null)

  // Lista de reportes disponibles
  const reportes = [
    {
      id: "puntos-excel",
      title: "Reporte puntos Excel",
      description: "Generar reporte de puntos en formato Excel",
      component: ReportExcel,
    },
    {
      id: "format-ansible",
      title: "Reporte formato Ansible",
      description: "Generar archivo de directorios de puntoss en formato Ansible",
      component: ReportFormatAnsible,
    },
  ]

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      setLoading(true)
      try {
        // Cargar datos en paralelo
        const [zonasData, ccostoData, tipoConexionesData] = await Promise.all([
          getAllZonas(token),
          getAllCcosto(token),
          getAllTipoConexiones(token),
        ])

        setZonas(zonasData)
        setCentrosCosto(ccostoData)
        setTipoConexiones(tipoConexionesData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        showNotification("Error al cargar los datos", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  // Función para mostrar notificaciones
  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  // Función para cerrar notificaciones
  const closeNotification = () => {
    setNotification({ message: "", type: "" })
  }

  // Función para manejar el acordeón
  const toggleAccordion = (reportId) => {
    if (reportes.find((r) => r.id === reportId)?.disabled) return
    setActiveAccordion(activeAccordion === reportId ? null : reportId)
  }

  // Funciones para manejar los toggles de filtros
  const toggleZona = (code) => {
    setActiveZonas((prev) => {
      const newActive = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
      checkGlobalFilter(newActive, activeCentrosCosto, activeTipoConexiones)
      return newActive
    })
  }

  const toggleCentroCosto = (code) => {
    setActiveCentrosCosto((prev) => {
      const newActive = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
      checkGlobalFilter(activeZonas, newActive, activeTipoConexiones)
      return newActive
    })
  }

  const toggleTipoConexion = (code) => {
    setActiveTipoConexiones((prev) => {
      const newActive = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
      checkGlobalFilter(activeZonas, activeCentrosCosto, newActive)
      return newActive
    })
  }

  const checkGlobalFilter = (zonas, centros, tipos) => {
    const hasSelections = zonas.length > 0 || centros.length > 0 || tipos.length > 0
    if (hasSelections && globalNoFilter) {
      setGlobalNoFilter(false)
    }
  }

  const toggleGlobalNoFilter = () => {
    if (globalNoFilter) {
      setGlobalNoFilter(false)
    } else {
      setActiveZonas([])
      setActiveCentrosCosto([])
      setActiveTipoConexiones([])
      setGlobalNoFilter(true)
    }
  }

  // Función para generar y descargar el reporte
  const handleDownloadReport = async () => {
    setDownloadLoading(true)
    try {
      const zonaCode = activeZonas.join(",")
      const centroCostoCode = activeCentrosCosto.join(",")
      const tipoConexionCode = activeTipoConexiones.join(",")

      await getReportExcel(token, {
        tipoConexionCode,
        zonaCode,
        centroCostoCode,
      })

      showNotification("Reporte descargado exitosamente", "success")
    } catch (error) {
      console.error("Error al descargar reporte:", error)
      showNotification("Error al generar el reporte", "error")
    } finally {
      setDownloadLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="reports-loading-spinner"></div>
        <span>Cargando datos...</span>
      </div>
    )
  }

  return (
    <>
      <div className="reports-container">
        {/* Header del título */}
        <div className="reports-title-header">
          <div className="reports-title-content">
            <FiFileText className="reports-title-icon" />
            <h2>Reportes</h2>
          </div>
        </div>

        {/* Lista de reportes disponibles */}
        <div className="reports-list">
          {reportes.map((reporte) => {
            const ReportComponent = reporte.component

            return (
              <div key={reporte.id} className="reports-accordion">
                <div
                  className={`reports-accordion-header ${reporte.disabled ? "disabled" : ""}`}
                  onClick={() => toggleAccordion(reporte.id)}
                >
                  <div className="reports-accordion-info">
                    <h3>{reporte.title}</h3>
                    <p>{reporte.description}</p>
                  </div>
                  <div className="reports-accordion-icon">
                    {!reporte.disabled && (activeAccordion === reporte.id ? <FiChevronUp /> : <FiChevronDown />)}
                  </div>
                </div>

                {/* Contenido del acordeón */}
                {activeAccordion === reporte.id && (
                  <div className="reports-accordion-content">
                    {ReportComponent ? (
                      <ReportComponent
                        zonas={zonas}
                        centrosCosto={centrosCosto}
                        tipoConexiones={tipoConexiones}
                        activeZonas={activeZonas}
                        activeCentrosCosto={activeCentrosCosto}
                        activeTipoConexiones={activeTipoConexiones}
                        toggleZona={toggleZona}
                        toggleCentroCosto={toggleCentroCosto}
                        toggleTipoConexion={toggleTipoConexion}
                        globalNoFilter={globalNoFilter}
                        toggleGlobalNoFilter={toggleGlobalNoFilter}
                        handleDownloadReport={handleDownloadReport}
                        downloadLoading={downloadLoading}
                      />
                    ) : (
                      <div className="reports-empty-content">
                        <p>Este reporte estará disponible próximamente.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Componente de notificación */}
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  )
}

export default Reports
