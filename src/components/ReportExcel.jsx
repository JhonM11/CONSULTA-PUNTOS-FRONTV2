import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { FiDownload } from "react-icons/fi"
import { getAllTipoConexiones } from "../services/tipoconexionesService"
import { getAllZonas } from "../services/zonaServices"
import { getAllCcosto } from "../services/ccostoService"
import { getReportExcel } from "../services/reportesService"
import Notification from "./Notification"
import "../styles/reportsexcel.css"

function ReportExcel() {
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
      <div className="report-excel-loading">
        <div className="report-excel-loading-spinner"></div>
        <span>Cargando datos...</span>
      </div>
    )
  }

  return (
    <>
      <div className="report-excel-container">
        {/* Contenedores de filtros */}
        <div className="report-excel-filters-container">
          {/* Contenedor de Zonas */}
          <div className="report-excel-filter-card">
            <div className="report-excel-filter-header">
              <h3>Zonas</h3>
              <span className="report-excel-filter-count">{activeZonas.length} seleccionadas</span>
            </div>
            <div className="report-excel-filter-list">
              {zonas.map((zona) => (
                <div key={zona.code} className="report-excel-filter-item">
                  <span className="report-excel-filter-name">{zona.name}</span>
                  <label className="report-excel-toggle">
                    <input
                      type="checkbox"
                      checked={activeZonas.includes(zona.code)}
                      onChange={() => toggleZona(zona.code)}
                    />
                    <span className="report-excel-toggle-slider"></span>
                  </label>
                </div>
              ))}
              {zonas.length === 0 && <div className="report-excel-filter-empty">No hay zonas disponibles</div>}
            </div>
          </div>

          {/* Contenedor de Centros de Costo */}
          <div className="report-excel-filter-card">
            <div className="report-excel-filter-header">
              <h3>Centros de Costo</h3>
              <span className="report-excel-filter-count">{activeCentrosCosto.length} seleccionados</span>
            </div>
            <div className="report-excel-filter-list">
              {centrosCosto.map((centro) => (
                <div key={centro.code} className="report-excel-filter-item">
                  <span className="report-excel-filter-name">{centro.name}</span>
                  <label className="report-excel-toggle">
                    <input
                      type="checkbox"
                      checked={activeCentrosCosto.includes(centro.code)}
                      onChange={() => toggleCentroCosto(centro.code)}
                    />
                    <span className="report-excel-toggle-slider"></span>
                  </label>
                </div>
              ))}
              {centrosCosto.length === 0 && (
                <div className="report-excel-filter-empty">No hay centros de costo disponibles</div>
              )}
            </div>
          </div>

          {/* Contenedor de Tipo Conexiones */}
          <div className="report-excel-filter-card">
            <div className="report-excel-filter-header">
              <h3>Tipo Conexiones</h3>
              <span className="report-excel-filter-count">{activeTipoConexiones.length} seleccionadas</span>
            </div>
            <div className="report-excel-filter-list">
              {tipoConexiones.map((tipo) => (
                <div key={tipo.code} className="report-excel-filter-item">
                  <span className="report-excel-filter-name">{tipo.name}</span>
                  <label className="report-excel-toggle">
                    <input
                      type="checkbox"
                      checked={activeTipoConexiones.includes(tipo.code)}
                      onChange={() => toggleTipoConexion(tipo.code)}
                    />
                    <span className="report-excel-toggle-slider"></span>
                  </label>
                </div>
              ))}
              {tipoConexiones.length === 0 && (
                <div className="report-excel-filter-empty">No hay tipos de conexión disponibles</div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle global "Sin filtro / todo" */}
        <div className="report-excel-global-filter">
          <div className="report-excel-global-filter-item">
            <span className="report-excel-global-filter-name">Sin filtro / todo</span>
            <label className="report-excel-toggle">
              <input type="checkbox" checked={globalNoFilter} onChange={toggleGlobalNoFilter} />
              <span className="report-excel-toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Botón de descarga */}
        <div className="report-excel-download-section">
          <button
            className="report-excel-download-btn"
            onClick={handleDownloadReport}
            disabled={
              downloadLoading ||
              (!globalNoFilter &&
                activeZonas.length === 0 &&
                activeCentrosCosto.length === 0 &&
                activeTipoConexiones.length === 0)
            }
          >
            {downloadLoading ? (
              <>
                <div className="report-excel-download-spinner"></div>
                Generando reporte...
              </>
            ) : (
              <>
                <FiDownload />
                Descargar Reporte Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Componente de notificación */}
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  )
}

export default ReportExcel
