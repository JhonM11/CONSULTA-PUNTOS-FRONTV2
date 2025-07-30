import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { FiDownload } from "react-icons/fi"
import { getAllTipoConexiones } from "../services/tipoconexionesService"
import { getAllZonas } from "../services/zonaServices"
import { getAllCcosto } from "../services/ccostoService"
import { getReportFormatAnsible } from "../services/reportesService"
import Notification from "./Notification"
import "../styles/reportsformatansible.css"

function ReportFormatAnsible() {
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

  // Estado para el nombre del archivo
  const [filename, setFilename] = useState("")

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

      await getReportFormatAnsible(token, {
        tipoConexionCode,
        zonaCode,
        centroCostoCode,
        filename: filename.trim(),
      })

      showNotification("Archivo Ansible descargado exitosamente", "success")
    } catch (error) {
      console.error("Error al descargar archivo:", error)
      showNotification("Error al generar el archivo Ansible", "error")
    } finally {
      setDownloadLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="report-ansible-loading">
        <div className="report-ansible-loading-spinner"></div>
        <span>Cargando datos...</span>
      </div>
    )
  }

  return (
    <>
      <div className="report-ansible-container">
        {/* Contenedores de filtros */}
        <div className="report-ansible-filters-container">
          {/* Contenedor de Zonas */}
          <div className="report-ansible-filter-card">
            <div className="report-ansible-filter-header">
              <h3>Zonas</h3>
              <span className="report-ansible-filter-count">{activeZonas.length} seleccionadas</span>
            </div>
            <div className="report-ansible-filter-list">
              {zonas.map((zona) => (
                <div key={zona.code} className="report-ansible-filter-item">
                  <span className="report-ansible-filter-name">{zona.name}</span>
                  <label className="report-ansible-toggle">
                    <input
                      type="checkbox"
                      checked={activeZonas.includes(zona.code)}
                      onChange={() => toggleZona(zona.code)}
                    />
                    <span className="report-ansible-toggle-slider"></span>
                  </label>
                </div>
              ))}
              {zonas.length === 0 && <div className="report-ansible-filter-empty">No hay zonas disponibles</div>}
            </div>
          </div>

          {/* Contenedor de Centros de Costo */}
          <div className="report-ansible-filter-card">
            <div className="report-ansible-filter-header">
              <h3>Centros de Costo</h3>
              <span className="report-ansible-filter-count">{activeCentrosCosto.length} seleccionados</span>
            </div>
            <div className="report-ansible-filter-list">
              {centrosCosto.map((centro) => (
                <div key={centro.code} className="report-ansible-filter-item">
                  <span className="report-ansible-filter-name">{centro.name}</span>
                  <label className="report-ansible-toggle">
                    <input
                      type="checkbox"
                      checked={activeCentrosCosto.includes(centro.code)}
                      onChange={() => toggleCentroCosto(centro.code)}
                    />
                    <span className="report-ansible-toggle-slider"></span>
                  </label>
                </div>
              ))}
              {centrosCosto.length === 0 && (
                <div className="report-ansible-filter-empty">No hay centros de costo disponibles</div>
              )}
            </div>
          </div>

          {/* Contenedor de Tipo Conexiones */}
          <div className="report-ansible-filter-card">
            <div className="report-ansible-filter-header">
              <h3>Tipo Conexiones</h3>
              <span className="report-ansible-filter-count">{activeTipoConexiones.length} seleccionadas</span>
            </div>
            <div className="report-ansible-filter-list">
              {tipoConexiones.map((tipo) => (
                <div key={tipo.code} className="report-ansible-filter-item">
                  <span className="report-ansible-filter-name">{tipo.name}</span>
                  <label className="report-ansible-toggle">
                    <input
                      type="checkbox"
                      checked={activeTipoConexiones.includes(tipo.code)}
                      onChange={() => toggleTipoConexion(tipo.code)}
                    />
                    <span className="report-ansible-toggle-slider"></span>
                  </label>
                </div>
              ))}
              {tipoConexiones.length === 0 && (
                <div className="report-ansible-filter-empty">No hay tipos de conexión disponibles</div>
              )}
            </div>
          </div>
        </div>

        {/* Campo de texto para nombre del archivo */}
        <div className="report-ansible-filename-section">
          <div className="report-ansible-filename-field">
            <label className="report-ansible-filename-label">Nombre del archivo</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Nombre del archivo (opcional)"
              className="report-ansible-filename-input"
            />
          </div>
        </div>

        {/* Toggle global "Sin filtro / todo" */}
        <div className="report-ansible-global-filter">
          <div className="report-ansible-global-filter-item">
            <span className="report-ansible-global-filter-name">Todos los puntos</span>
            <label className="report-ansible-toggle">
              <input type="checkbox" checked={globalNoFilter} onChange={toggleGlobalNoFilter} />
              <span className="report-ansible-toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Botón de descarga */}
        <div className="report-ansible-download-section">
          <button
            className="report-ansible-download-btn"
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
                <div className="report-ansible-download-spinner"></div>
                Generando archivo...
              </>
            ) : (
              <>
                <FiDownload />
                Descargar Archivo Ansible
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

export default ReportFormatAnsible
