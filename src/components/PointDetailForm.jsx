import { FiX } from "react-icons/fi"
import "../styles/point-detail.css"

function PointDetailForm({ detailData, onClose }) {
  return (
    <div className="point-form-overlay">
      <div className="point-form">
        <div className="point-form-header">
          <span>Detalles del Punto</span>
          <button className="point-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="point-form-body">
          <div className="point-detail-grid">
            <div className="point-detail-field">
              <label>Código:</label>
              <span>{detailData.codigo}</span>
            </div>
            <div className="point-detail-field">
              <label>Nombre:</label>
              <span>{detailData.nombre}</span>
            </div>
            <div className="point-detail-field">
              <label>Tecnología:</label>
              <span>{detailData.tecnologia || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>IP Radio:</label>
              <span>{detailData.ipRadio || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>IP Teléfono:</label>
              <span>{detailData.ipTelefono || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>PC Venta:</label>
              <span>{detailData.pcVenta || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>Raspberry:</label>
              <span>{detailData.raspberry || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>RBetplay:</label>
              <span>{detailData.rbetplay || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>DVR:</label>
              <span>{detailData.dvr || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>PC Admin 1:</label>
              <span>{detailData.pcAdmin1 || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>PC Admin 2:</label>
              <span>{detailData.pcAdmin2 || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>PC Admin 3:</label>
              <span>{detailData.pcAdmin3 || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>Tipo Conexión:</label>
              <span>{detailData.tipoConexion?.name || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>Zona:</label>
              <span>{detailData.zona?.name || "N/A"}</span>
            </div>
            <div className="point-detail-field">
              <label>Centro de Costo:</label>
              <span>{detailData.centroCosto?.name || "N/A"}</span>
            </div>
            <div className="point-detail-field point-detail-field-full">
              <label>Observación:</label>
              <span>{detailData.observacion || "N/A"}</span>
            </div>
            <div className="point-detail-field point-detail-field-full">
              <label>Nota:</label>
              <span>{detailData.nota || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PointDetailForm
