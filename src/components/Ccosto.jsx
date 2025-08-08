// Ccosto.jsx
import { useEffect, useState } from "react"
import { getAllCcosto, createCcosto, updateNameCcosto } from "../services/ccostoService"
import { getAllZonas } from "../services/zonaServices"          // 👈 importar
import { useAuth } from "./AuthContext"
import { FiEdit2, FiSearch, FiPlus, FiX, FiSave, FiMap } from "react-icons/fi"
import Notification from "./Notification"
import '../styles/ccosto.css';

function Ccosto() {
  const { token } = useAuth()

  const [centros, setCentros] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  const [newName, setNewName] = useState("")
  const [selectedZonaCode, setSelectedZonaCode] = useState("")   // 👈 zona elegida

  const [zonas, setZonas] = useState([])                         // 👈 lista de zonas
  const [loadingZonas, setLoadingZonas] = useState(false)
  const [zonasError, setZonasError] = useState("")

  const [editData, setEditData] = useState({ code: "", name: "", newName: "" })
  const [notification, setNotification] = useState({ message: "", type: "" })
  const itemsPerPage = 5

  // ====== Cargar centros ======
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllCcosto(token)
        setCentros(data)
        setFiltered(applyFilter(data, search))
        setCurrentPage(1)
      } catch (err) {
        console.error("Error al cargar centros de costos", err)
      }
    }
    if (token) fetchAll()
  }, [token])

  // ====== Filtro ======
  useEffect(() => {
    setFiltered(applyFilter(centros, search))
    setCurrentPage(1)
  }, [search, centros])

  const applyFilter = (list, term) => {
    const q = term.trim().toLowerCase()
    if (!q) return list
    return list.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      String(item.code).includes(q) ||
      String(item.zonaCode ?? '').includes(q) ||
      (item.zonaName ?? '').toLowerCase().includes(q)
    )
  }

  // ====== Cargar zonas cuando se abre el formulario ======
  useEffect(() => {
    const loadZonas = async () => {
      try {
        setLoadingZonas(true)
        setZonasError("")
        const data = await getAllZonas(token)     // 👈 consume tu servicio
        // Se asume que devuelve [{ code, name }, ...] o {code,name,zonaCode?}
        setZonas(data)
      } catch (e) {
        console.error("Error al cargar zonas", e)
        setZonasError("No se pudieron cargar las zonas")
      } finally {
        setLoadingZonas(false)
      }
    }

    if (showForm && zonas.length === 0 && token) {
      loadZonas()
    }
  }, [showForm, token, zonas.length])

  // ====== Paginación ======
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  // ====== Crear ======
  const handleGuardar = async () => {
    try {
      if (!newName.trim()) {
        return showNotification("Por favor ingresa un nombre válido", "warning")
      }
      if (!selectedZonaCode) {
        return showNotification("Selecciona una zona", "warning")
      }

      await createCcosto(token, newName.trim(), Number(selectedZonaCode)) // 👈 envía zonaCode
      setNewName("")
      setSelectedZonaCode("")
      setShowForm(false)

      const data = await getAllCcosto(token)
      setCentros(data)
      setFiltered(data)

      showNotification("Centro de costo creado exitosamente", "success")
    } catch (err) {
      console.error("Error al crear centro de costo", err)
      showNotification("Error al crear el centro de costo", "error")
    }
  }

  // ====== Editar (solo nombre, como antes) ======
  const handleEdit = (item) => {
    setEditData({ code: item.code, name: item.name, newName: item.name })
    setShowEditForm(true)
  }

  const handleUpdateCcosto = async () => {
    try {
      if (!editData.newName.trim()) {
        return showNotification("Por favor ingresa un nombre válido", "warning")
      }
      if (editData.newName.trim() === editData.name) {
        return showNotification("El nombre debe ser diferente al actual", "warning")
      }

      await updateNameCcosto(token, editData.code, editData.newName.trim())

      setEditData({ code: "", name: "", newName: "" })
      setShowEditForm(false)

      const data = await getAllCcosto(token)
      setCentros(data)
      setFiltered(data)

      showNotification("Centro de costo actualizado exitosamente", "success")
    } catch (err) {
      console.error("Error al actualizar centro de costo", err)
      showNotification("Error al actualizar el centro de costo", "error")
    }
  }

  const handleCloseForm = () => {
    setNewName("")
    setSelectedZonaCode("")
    setShowForm(false)
  }
  const handleCloseEditForm = () => {
    setEditData({ code: "", name: "", newName: "" })
    setShowEditForm(false)
  }

  const showNotification = (message, type) => setNotification({ message, type })
  const closeNotification = () => setNotification({ message: "", type: "" })

  return (
    <>
      <div className="ccosto-container">
        {/* Título */}
        <div className="ccosto-title-header">
          <div className="ccosto-title-content">
            <FiMap className="ccosto-title-icon" />
            <h2>Centros de Costos</h2>
          </div>
        </div>

        {/* Search + botón crear */}
        <div className="ccosto-header">
          <div className="ccosto-search-bar">
            <div className="ccosto-search-wrapper">
              <FiSearch className="ccosto-search-icon" />
              <input
                type="text"
                placeholder="Buscar por código, nombre o zona..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <button className="ccosto-add-btn" onClick={() => setShowForm(!showForm)} title="Crear nuevo centro de costo">
            <FiPlus />
          </button>
        </div>

        {/* Form crear */}
        {showForm && (
          <div className="ccosto-form-overlay">
            <div className="ccosto-form">
              <div className="ccosto-form-header">
                <span>Crear Centro de Costo</span>
                <button className="ccosto-close-btn" onClick={handleCloseForm}>
                  <FiX />
                </button>
              </div>

              <div className="ccosto-form-body">
                <input
                  type="text"
                  value={newName}
                  placeholder="Nombre del centro de costo"
                  onChange={(e) => setNewName(e.target.value.toUpperCase())}
                  className="ccosto-form-input"
                />

                {/* SELECT de zonas */}
                <select
                  className="ccosto-form-input"
                  value={selectedZonaCode}
                  onChange={(e) => setSelectedZonaCode(e.target.value)}
                  disabled={loadingZonas || !!zonasError}
                >
                  <option value="">Selecciona una zona...</option>
                  {zonas.map(z => (
                    <option key={z.code} value={z.code}>
                      {z.name} {/* o z.zonaName si así viene */}
                    </option>
                  ))}
                </select>
                {loadingZonas && <small>Cargando zonas…</small>}
                {zonasError && <small className="error">{zonasError}</small>}

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

        {/* Form editar (igual que antes) */}
        {showEditForm && (
          <div className="ccosto-form-overlay">
            <div className="ccosto-form">
              <div className="ccosto-form-header">
                <span>Editar Centro de Costo</span>
                <button className="ccosto-close-btn" onClick={handleCloseEditForm}>
                  <FiX />
                </button>
              </div>
              <div className="ccosto-form-body">
                <input
                  type="text"
                  value={editData.newName}
                  placeholder="Nombre del centro de costo"
                  onChange={(e) => setEditData({ ...editData, newName: e.target.value.toUpperCase() })}
                  className="ccosto-form-input"
                />
                <div className="ccosto-form-actions">
                  <button className="ccosto-cancel-btn" onClick={handleCloseEditForm}>
                    Cancelar
                  </button>
                  <button className="ccosto-save-btn" onClick={handleUpdateCcosto}>
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
        <th>Zona</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      {paginatedItems.map((item) => (
        <tr key={item.code}>
          <td>{item.code}</td>
          <td>{item.name}</td>
          <td>{item.zonaName ?? '-'}</td> 
          <td>
            <button
              className="ccosto-edit-btn"
              title="Editar"
              onClick={() => handleEdit(item)}
            >
              <FiEdit2 size={16} />
            </button>
          </td>
        </tr>
      ))}
      {paginatedItems.length === 0 && (
        <tr>
          <td colSpan="4" className="ccosto-empty">
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

      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  )
}

export default Ccosto
