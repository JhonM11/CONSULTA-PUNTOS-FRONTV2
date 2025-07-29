import { useEffect, useState } from "react"
import { getAllCcosto, createCcosto } from "../services/ccostoService"
import { useAuth } from "./AuthContext"
import { FiEdit2, FiSearch, FiPlus, FiX, FiSave } from "react-icons/fi"
import '../styles/ccosto.css';


function Ccosto() {
  const { token } = useAuth()
  const [centros, setCentros] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState("")
  const itemsPerPage = 5

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCcosto(token)
        setCentros(data)
        setFiltered(data)
      } catch (err) {
        console.error("Error al cargar centros de costos", err)
      }
    }
    if (token) fetchData()
  }, [token])

  useEffect(() => {
    const result = centros.filter(
      (item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toString().includes(search),
    )
    setFiltered(result)
    setCurrentPage(1)
  }, [search, centros])

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const handleGuardar = async () => {
    try {
      if (!newName.trim()) return
      await createCcosto(token, newName.trim())
      setNewName("")
      setShowForm(false)
      const data = await getAllCcosto(token)
      setCentros(data)
      setFiltered(data)
    } catch (err) {
      console.error("Error al crear centro de costo", err)
    }
  }

  const handleCloseForm = () => {
    setNewName("")
    setShowForm(false)
  }

  return (
    <div className="ccosto-container">
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
        <button className="ccosto-add-btn" onClick={() => setShowForm(!showForm)} title="Crear nuevo centro de costo">
          <FiPlus />
        </button>
      </div>

      {/* Formulario flotante */}
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
                  <button className="ccosto-edit-btn" title="Editar">
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
  )
}

export default Ccosto
