import { useEffect, useMemo, useState } from "react"
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

  // Datos base
  const [zonas, setZonas] = useState([])
  const [centrosCosto, setCentrosCosto] = useState([])
  const [tipoConexiones, setTipoConexiones] = useState([])

  // Selecciones activas
  const [activeZonas, setActiveZonas] = useState([])
  const [activeCentrosCosto, setActiveCentrosCosto] = useState([])
  const [activeTipoConexiones, setActiveTipoConexiones] = useState([])

  // Global sin filtro
  const [globalNoFilter, setGlobalNoFilter] = useState(true)

  // UI
  const [notification, setNotification] = useState({ message: "", type: "" })
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)

  const str = (v) => String(v ?? "")

  // Cargar datos al montar
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      setLoading(true)
      try {
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

  // Notificaciones
  const showNotification = (message, type) => setNotification({ message, type })
  const closeNotification = () => setNotification({ message: "", type: "" })

  // Global filter toggle
  const checkGlobalFilter = (zonasSel, centrosSel, tiposSel) => {
    const hasSelections = zonasSel.length > 0 || centrosSel.length > 0 || tiposSel.length > 0
    if (hasSelections && globalNoFilter) setGlobalNoFilter(false)
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

  // ===== Lógica de filtrado pedida =====
  // Zonas → filtran Centros; seleccionar Centros NO oculta ni altera Zonas.
  const toggleZona = (code) => {
    setActiveZonas((prev) => {
      const exists = prev.includes(code)
      const newActiveZonas = exists ? prev.filter((c) => c !== code) : [...prev, code]

      // Al cambiar zonas, quitar de la selección los centros que ya no pertenecen
      setActiveCentrosCosto((prevCC) => {
        if (newActiveZonas.length === 0) return prevCC // sin zonas => no depuramos
        return prevCC.filter((ccCode) => {
          const centro = centrosCosto.find((c) => str(c.code) === str(ccCode))
          return centro ? newActiveZonas.includes(centro.zonaCode) : false
        })
      })

      checkGlobalFilter(newActiveZonas, activeCentrosCosto, activeTipoConexiones)
      return newActiveZonas
    })
  }

  const toggleCentroCosto = (code) => {
    // Solo alterna selección; NO toca zonas ni visibilidad de zonas
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

  // Listas visibles en UI
  const visibleZonas = useMemo(() => zonas, [zonas]) // Zonas siempre visibles (no se ocultan)
  const visibleCentrosCosto = useMemo(() => {
    if (activeZonas.length > 0) {
      return centrosCosto.filter((c) => activeZonas.includes(c.zonaCode))
    }
    return centrosCosto
  }, [activeZonas, centrosCosto])

  // Descargar reporte
  const handleDownloadReport = async () => {
    setDownloadLoading(true)
    try {
      const zonaCode = activeZonas.join(",")
      const centroCostoCode = activeCentrosCosto.join(",")
      const tipoConexionCode = activeTipoConexiones.join(",")

      await getReportExcel(token, { tipoConexionCode, zonaCode, centroCostoCode })
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
          {/* Zonas */}
          <div className="report-excel-filter-card">
            <div className="report-excel-filter-header">
              <h3>Zonas</h3>
              <span className="report-excel-filter-count">{activeZonas.length} seleccionadas</span>
            </div>
            <div className="report-excel-filter-list">
              {visibleZonas.map((zona) => (
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
              {visibleZonas.length === 0 && <div className="report-excel-filter-empty">No hay zonas disponibles</div>}
            </div>
          </div>

          {/* Centros de Costo */}
          <div className="report-excel-filter-card">
            <div className="report-excel-filter-header">
              <h3>Centros de Costo</h3>
              <span className="report-excel-filter-count">{activeCentrosCosto.length} seleccionados</span>
            </div>
            <div className="report-excel-filter-list">
              {visibleCentrosCosto.map((centro) => (
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
              {visibleCentrosCosto.length === 0 && (
                <div className="report-excel-filter-empty">No hay centros de costo disponibles</div>
              )}
            </div>
          </div>

          {/* Tipo Conexiones */}
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
            <span className="report-excel-global-filter-name">Todo los puntos</span>
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

      {/* Notificación */}
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  )
}

export default ReportExcel
