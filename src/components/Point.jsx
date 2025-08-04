import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { FiMapPin, FiSearch, FiPlusCircle } from "react-icons/fi"
import { getAllPoints, createPoint, updatePoint, deletePoint } from "../services/puntosService"
import { getAllTipoConexiones } from "../services/tipoconexionesService"
import { getAllZonas } from "../services/zonaServices"
import { getAllCcosto } from "../services/ccostoService"
import Notification from "./Notification"
import PointTable from "./PointTable"
import PointCreateForm from "./PointCreateForm"
import PointEditForm from "./PointEditForm"
import PointDetailForm from "./PointDetailForm"
import "../styles/point.css"

function Point() {
  const { token, role } = useAuth()
  const [points, setPoints] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailForm, setShowDetailForm] = useState(false)
  const [editData, setEditData] = useState({})
  const [detailData, setDetailData] = useState({})
  const [createData, setCreateData] = useState({
    codigo: "", // Añadido el campo codigo
    nombre: "",
    tecnologia: "",
    observacion: "",
    ipRadio: "",
    ipTelefono: "",
    raspberry: "",
    rbetplay: "",
    dvr: "",
    pcVenta: "",
    pcAdmin1: "",
    pcAdmin2: "",
    pcAdmin3: "",
    nota: "",
    tipoConexionCode: "",
    zonaCode: "",
    centroCostoCode: "",
  })
  const [notification, setNotification] = useState({ message: "", type: "" })
  const [loading, setLoading] = useState(false)

  const itemsPerPage = 5

  // Estados para los datos de selección
  const [zonas, setZonas] = useState([])
  const [centrosCosto, setCentrosCosto] = useState([])
  const [tipoConexiones, setTipoConexiones] = useState([])

  // Cargar puntos
  useEffect(() => {
    const fetchPoints = async () => {
      if (!token) return
      setLoading(true)
      try {
        const data = await getAllPoints(token)
        setPoints(data)
        setFiltered(data)
      } catch (err) {
        console.error("Error al cargar puntos", err)
        showNotification("Error al cargar los puntos", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchPoints()
  }, [token])

  // Cargar datos iniciales para selects
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) return
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
        console.error("Error al cargar datos iniciales:", error)
      }
    }
    fetchInitialData()
  }, [token])

  // Filtrar puntos por búsqueda
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(points)
    } else {
      const result = points.filter((point) => {
        const searchLower = search.toLowerCase()
        return (
          point.codigo?.toString().includes(searchLower) ||
          point.nombre?.toLowerCase().includes(searchLower) ||
          point.tecnologia?.toLowerCase().includes(searchLower) ||
          point.observacion?.toLowerCase().includes(searchLower) ||
          point.ipRadio?.toLowerCase().includes(searchLower) ||
          point.ipTelefono?.toLowerCase().includes(searchLower) ||
          point.raspberry?.toLowerCase().includes(searchLower) ||
          point.rbetplay?.toLowerCase().includes(searchLower) ||
          point.dvr?.toLowerCase().includes(searchLower) ||
          point.pcVenta?.toLowerCase().includes(searchLower) ||
          point.pcAdmin1?.toLowerCase().includes(searchLower) ||
          point.pcAdmin2?.toLowerCase().includes(searchLower) ||
          point.pcAdmin3?.toLowerCase().includes(searchLower) ||
          point.nota?.toLowerCase().includes(searchLower) ||
          point.tipoConexion?.name?.toLowerCase().includes(searchLower) ||
          point.zona?.name?.toLowerCase().includes(searchLower) ||
          point.centroCosto?.name?.toLowerCase().includes(searchLower)
        )
      })
      setFiltered(result)
    }
    setCurrentPage(1)
  }, [search, points])

  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  const closeNotification = () => {
    setNotification({ message: "", type: "" })
  }

  // Función para refrescar datos
  const refreshPoints = async () => {
    try {
      const data = await getAllPoints(token)
      setPoints(data)
      setFiltered(data)
    } catch (err) {
      console.error("Error al refrescar puntos", err)
      showNotification("Error al refrescar los puntos", "error")
    }
  }

  // Función para crear punto
  const handleCreatePoint = async () => {
    try {
      // Validación para el campo codigo y nombre
      if (!createData.codigo.trim()) {
        showNotification("Por favor ingresa un código válido", "warning")
        return
      }
      if (!createData.nombre.trim()) {
        showNotification("Por favor ingresa un nombre válido", "warning")
        return
      }

      await createPoint(token, createData)
      setCreateData({
        codigo: "", // Resetear el campo codigo
        nombre: "",
        tecnologia: "",
        observacion: "",
        ipRadio: "",
        ipTelefono: "",
        raspberry: "",
        rbetplay: "",
        dvr: "",
        pcVenta: "",
        pcAdmin1: "",
        pcAdmin2: "",
        pcAdmin3: "",
        nota: "",
        tipoConexionCode: "",
        zonaCode: "",
        centroCostoCode: "",
      })
      setShowCreateForm(false)
      await refreshPoints()
      showNotification("Punto creado exitosamente", "success")
    } catch (err) {
      console.error("Error al crear punto", err)
      showNotification("Error al crear el punto", "error")
    }
  }

  // Función para editar punto
  const handleEdit = (point) => {
    setEditData({
      codigo: point.codigo,
      nombre: point.nombre,
      tecnologia: point.tecnologia,
      observacion: point.observacion,
      ipRadio: point.ipRadio,
      ipTelefono: point.ipTelefono,
      raspberry: point.raspberry,
      rbetplay: point.rbetplay,
      dvr: point.dvr,
      pcVenta: point.pcVenta,
      pcAdmin1: point.pcAdmin1,
      pcAdmin2: point.pcAdmin2,
      pcAdmin3: point.pcAdmin3,
      nota: point.nota,
      tipoConexionCode: point.tipoConexion?.code || "",
      zonaCode: point.zona?.code || "",
      centroCostoCode: point.centroCosto?.code || "",
    })
    setShowEditForm(true)
  }

  const handleUpdatePoint = async () => {
    try {
      if (!editData.nombre?.trim()) {
        showNotification("Por favor ingresa un nombre válido", "warning")
        return
      }

      const { codigo, ...dataToUpdate } = editData
      await updatePoint(token, codigo, dataToUpdate)
      setEditData({})
      setShowEditForm(false)
      await refreshPoints()
      showNotification("Punto actualizado exitosamente", "success")
    } catch (err) {
      console.error("Error al actualizar punto", err)
      showNotification("Error al actualizar el punto", "error")
    }
  }

  // Función para mostrar detalles
  const handleShowDetails = (point) => {
    setDetailData(point)
    setShowDetailForm(true)
  }

  // Función para eliminar punto
  const handleDelete = async (point) => {
    try {
      await deletePoint(token, point.codigo)
      await refreshPoints()
      showNotification("Punto eliminado exitosamente", "success")
    } catch (err) {
      console.error("Error al eliminar punto", err)
      showNotification("Error al eliminar el punto", "error")
    }
  }

  const handleCloseCreateForm = () => {
    setCreateData({
      codigo: "", // Resetear el campo codigo al cerrar
      nombre: "",
      tecnologia: "",
      observacion: "",
      ipRadio: "",
      ipTelefono: "",
      raspberry: "",
      rbetplay: "",
      dvr: "",
      pcVenta: "",
      pcAdmin1: "",
      pcAdmin2: "",
      pcAdmin3: "",
      nota: "",
      tipoConexionCode: "",
      zonaCode: "",
      centroCostoCode: "",
    })
    setShowCreateForm(false)
  }

  const handleCloseEditForm = () => {
    setEditData({})
    setShowEditForm(false)
  }

  const handleCloseDetailForm = () => {
    setDetailData({})
    setShowDetailForm(false)
  }

  if (loading) {
    return (
      <div className="point-loading">
        <div className="point-loading-spinner"></div>
        <span>Cargando puntos...</span>
      </div>
    )
  }

  return (
    <>
      <div className="point-container">
        {/* Header del título */}
        <div className="point-title-header">
          <div className="point-title-content">
            <FiMapPin className="point-title-icon" />
            <h2>Puntos</h2>
          </div>
          {(role === "ADMIN" || role === "COORDINADOR") && (
            <button className="point-create-btn" onClick={() => setShowCreateForm(true)} title="Crear nuevo punto">
              <FiPlusCircle />
              Crear Punto
            </button>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="point-search-container">
          <div className="point-search-wrapper">
            <FiSearch className="point-search-icon" />
            <input
              type="text"
              placeholder="Buscar puntos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de puntos */}
        <PointTable
          points={filtered}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShowDetails={handleShowDetails}
          role={role}
        />

        {/* Formularios */}
        {showCreateForm && (
          <PointCreateForm
            createData={createData}
            setCreateData={setCreateData}
            zonas={zonas}
            centrosCosto={centrosCosto}
            tipoConexiones={tipoConexiones}
            onSave={handleCreatePoint}
            onClose={handleCloseCreateForm}
          />
        )}

        {showEditForm && (
          <PointEditForm
            editData={editData}
            setEditData={setEditData}
            zonas={zonas}
            centrosCosto={centrosCosto}
            tipoConexiones={tipoConexiones}
            onSave={handleUpdatePoint}
            onClose={handleCloseEditForm}
          />
        )}

        {showDetailForm && <PointDetailForm detailData={detailData} onClose={handleCloseDetailForm} />}
      </div>

      {/* Componente de notificación */}
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  )
}

export default Point
