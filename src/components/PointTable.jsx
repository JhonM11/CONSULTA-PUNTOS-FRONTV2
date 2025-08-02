import { FiEdit2, FiTrash2, FiMaximize } from "react-icons/fi"
import Swal from "sweetalert2"
import "../styles/point-table.css"

function PointTable({ points, currentPage, setCurrentPage, itemsPerPage, onEdit, onDelete, onShowDetails, role }) {
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = points.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(points.length / itemsPerPage)

  // Función para obtener páginas visibles (máximo 5)
  const getVisiblePages = () => {
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  // Función para manejar eliminación con confirmación
  const handleDeleteWithConfirmation = async (point) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el punto "${point.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      color: "#111827",
      customClass: {
        popup: "point-swal-popup",
        title: "point-swal-title",
        content: "point-swal-content",
        confirmButton: "point-swal-confirm",
        cancelButton: "point-swal-cancel",
      },
    })

    if (result.isConfirmed) {
      onDelete(point)
    }
  }

  return (
    <>
      {/* Tabla */}
      <div className="point-table-container">
        <table className="point-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tecnología</th>
              <th>IP Radio</th>
              <th>PC Venta</th>
              <th>Tipo Conexión</th>
              <th>Zona</th>
              <th>Centro Costo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((point) => (
              <tr key={point.codigo}>
                <td>{point.codigo}</td>
                <td>{point.nombre}</td>
                <td>{point.tecnologia || "N/A"}</td>
                <td>{point.ipRadio || "N/A"}</td>
                <td>{point.pcVenta || "N/A"}</td>
                <td>{point.tipoConexion?.name || "N/A"}</td>
                <td>{point.zona?.name || "N/A"}</td>
                <td>{point.centroCosto?.name || "N/A"}</td>
                <td>
                  <div className="point-actions">
                    {(role === "ADMIN" || role === "COORDINADOR") && (
                      <button className="point-edit-btn" title="Editar" onClick={() => onEdit(point)}>
                        <FiEdit2 size={16} />
                      </button>
                    )}
                    <button className="point-detail-btn" title="Ver detalles" onClick={() => onShowDetails(point)}>
                      <FiMaximize size={16} />
                    </button>
                    {(role === "ADMIN" || role === "admin") && (
                      <button
                        className="point-delete-btn"
                        title="Eliminar"
                        onClick={() => handleDeleteWithConfirmation(point)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan="9" className="point-empty">
                  No hay resultados para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="point-pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="point-pagination-btn"
          >
            Anterior
          </button>

          <div className="point-pagination-numbers">
            {getVisiblePages().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`point-pagination-number ${currentPage === pageNum ? "active" : ""}`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="point-pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}
    </>
  )
}

export default PointTable
