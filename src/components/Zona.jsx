import { useEffect, useState } from "react"
import { getAllZonas, createZona, updateNameZona } from "../services/zonaServices"
import { useAuth } from "./AuthContext"
import { FiEdit2, FiSearch, FiPlus, FiX, FiSave, FiMap, FiMapPin } from "react-icons/fi"
import Notification from "./Notification"
import '../styles/zona.css';

function Zona() {
  const { token } = useAuth()
  const [zonas, setZonas] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [editData, setEditData] = useState({ code: "", name: "", newName: "" })
  const [notification, setNotification] = useState({ message: "", type: "" })
  const itemsPerPage = 5

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllZonas(token)
        setZonas(data)
        setFiltered(data)
      } catch (err) {
        console.error("Error al cargar zonas", err)
      }
    }
    if (token) fetchData()
  }, [token])

  useEffect(() => {
    const result = zonas.filter(
      (item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toString().includes(search),
    )
    setFiltered(result)
    setCurrentPage(1)
  }, [search, zonas])

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const handleGuardar = async () => {
    try {
      if (!newName.trim()) {
        showNotification("Por favor ingresa un nombre válido", "warning")
        return
      }

      await createZona(token, newName.trim())
      setNewName("")
      setShowForm(false)

      const data = await getAllZonas(token)
      setZonas(data)
      setFiltered(data)

      showNotification("Zona creada exitosamente", "success")
    } catch (err) {
      console.error("Error al crear zona", err)
      showNotification("Error al crear la zona", "error")
    }
  }

  const handleEdit = (item) => {
    setEditData({
      code: item.code,
      name: item.name,
      newName: item.name,
    })
    setShowEditForm(true)
  }

  const handleUpdateZona = async () => {
    try {
      if (!editData.newName.trim()) {
        showNotification("Por favor ingresa un nombre válido", "warning")
        return
      }

      if (editData.newName.trim() === editData.name) {
        showNotification("El nombre debe ser diferente al actual", "warning")
        return
      }

      await updateNameZona(token, editData.code, editData.newName.trim())

      setEditData({ code: "", name: "", newName: "" })
      setShowEditForm(false)

      const data = await getAllZonas(token)
      setZonas(data)
      setFiltered(data)

      showNotification("Zona actualizada exitosamente", "success")
    } catch (err) {
      console.error("Error al actualizar zona", err)
      showNotification("Error al actualizar la zona", "error")
    }
  }

  const handleCloseForm = () => {
    setNewName("")
    setShowForm(false)
  }

  const handleCloseEditForm = () => {
    setEditData({ code: "", name: "", newName: "" })
    setShowEditForm(false)
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  const closeNotification = () => {
    setNotification({ message: "", type: "" })
  }

  return (
    <>
      <div className="ccosto-container">
        {/* Header del título */}
        <div className="ccosto-title-header">
          <div className="ccosto-title-content">
            <FiMapPin className="ccosto-title-icon" />
            <h2>Zonas</h2>
          </div>
        </div>

        {/* Header con barra de búsqueda y botón */}
        <div className="ccosto-header">
          <div className="ccosto-search-bar">
            <div className="ccosto-search-wrapper">
              <FiSearch className="ccosto-search-icon" />
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <button className="ccosto-add-btn" onClick={() => setShowForm(!showForm)} title="Crear nueva zona">
            <FiPlus />
          </button>
        </div>

        {/* Formulario flotante para crear */}
        {showForm && (
          <div className="ccosto-form-overlay">
            <div className="ccosto-form">
              <div className="ccosto-form-header">
                <span>Crear Zona</span>
                <button className="ccosto-close-btn" onClick={handleCloseForm}>
                  <FiX />
                </button>
              </div>
              <div className="ccosto-form-body">
                <input
                  type="text"
                  value={newName}
                  placeholder="Nombre de la zona"
                  onChange={(e) => setNewName(e.target.value.toUpperCase())}
                  className="ccosto-form-input"
                />
                <div className="ccosto-form-actions">
                  <button className="ccosto-cancel-btn" onClick={handleCloseForm}>
                    Cancelar
                  </button>
                  <button className="ccosto-save-btn" onClick={handleGuardar}>
                    <FiSave /> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulario flotante para editar */}
        {showEditForm && (
          <div className="ccosto-form-overlay">
            <div className="ccosto-form">
              <div className="ccosto-form-header">
                <span>Editar Zona</span>
                <button className="ccosto-close-btn" onClick={handleCloseEditForm}>
                  <FiX />
                </button>
              </div>
              <div className="ccosto-form-body">
                <input
                  type="text"
                  value={editData.newName}
                  placeholder="Nombre de la zona"
                  onChange={(e) => setEditData({ ...editData, newName: e.target.value.toUpperCase() })}
                  className="ccosto-form-input"
                />
                <div className="ccosto-form-actions">
                  <button className="ccosto-cancel-btn" onClick={handleCloseEditForm}>
                    Cancelar
                  </button>
                  <button className="ccosto-save-btn" onClick={handleUpdateZona}>
                    <FiSave /> Actualizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div className="ccosto-table-container">
          <table className="ccosto-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr key={item.code}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>
                    <button className="ccosto-edit-btn" title="Editar" onClick={() => handleEdit(item)}>
                      <FiEdit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan="3" className="ccosto-empty">
                    No hay resultados para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="ccosto-pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="ccosto-pagination-btn"
            >
              Anterior
            </button>

            <div className="ccosto-pagination-numbers">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`ccosto-pagination-number ${currentPage === idx + 1 ? "active" : ""}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ccosto-pagination-btn"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Componente de notificación fuera del contenedor principal */}
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  )
}

export default Zona
