import { FiX, FiSave } from "react-icons/fi"
// Eliminamos las importaciones de shadcn/ui Select
import "../styles/point-form.css"

function PointEditForm({ editData, setEditData, zonas, centrosCosto, tipoConexiones, onSave, onClose }) {
  return (
    <div className="point-form-overlay">
      <div className="point-form">
        <div className="point-form-header">
          <span>Editar Punto</span>
          <button className="point-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="point-form-body">
          <div className="point-form-grid">
            <div className="point-form-field">
              <label>Código</label>
              <input type="text" value={editData.codigo || ""} disabled />
            </div>
            <div className="point-form-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={editData.nombre || ""}
                onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                placeholder="Nombre del punto"
              />
            </div>
            <div className="point-form-field">
              <label>Tecnología</label>
              <input
                type="text"
                value={editData.tecnologia || ""}
                onChange={(e) => setEditData({ ...editData, tecnologia: e.target.value })}
                placeholder="Tecnología"
              />
            </div>
            <div className="point-form-field">
              <label>IP Radio</label>
              <input
                type="text"
                value={editData.ipRadio || ""}
                onChange={(e) => setEditData({ ...editData, ipRadio: e.target.value })}
                placeholder="IP Radio"
              />
            </div>
            <div className="point-form-field">
              <label>IP Teléfono</label>
              <input
                type="text"
                value={editData.ipTelefono || ""}
                onChange={(e) => setEditData({ ...editData, ipTelefono: e.target.value })}
                placeholder="IP Teléfono"
              />
            </div>
            <div className="point-form-field">
              <label>PC Venta</label>
              <input
                type="text"
                value={editData.pcVenta || ""}
                onChange={(e) => setEditData({ ...editData, pcVenta: e.target.value })}
                placeholder="PC Venta"
              />
            </div>
            <div className="point-form-field">
              <label>Raspberry</label>
              <input
                type="text"
                value={editData.raspberry || ""}
                onChange={(e) => setEditData({ ...editData, raspberry: e.target.value })}
                placeholder="Raspberry"
              />
            </div>
            <div className="point-form-field">
              <label>RBetplay</label>
              <input
                type="text"
                value={editData.rbetplay || ""}
                onChange={(e) => setEditData({ ...editData, rbetplay: e.target.value })}
                placeholder="RBetplay"
              />
            </div>
            <div className="point-form-field">
              <label>DVR</label>
              <input
                type="text"
                value={editData.dvr || ""}
                onChange={(e) => setEditData({ ...editData, dvr: e.target.value })}
                placeholder="DVR"
              />
            </div>
            <div className="point-form-field">
              <label>PC Admin 1</label>
              <input
                type="text"
                value={editData.pcAdmin1 || ""}
                onChange={(e) => setEditData({ ...editData, pcAdmin1: e.target.value })}
                placeholder="PC Admin 1"
              />
            </div>
            <div className="point-form-field">
              <label>PC Admin 2</label>
              <input
                type="text"
                value={editData.pcAdmin2 || ""}
                onChange={(e) => setEditData({ ...editData, pcAdmin2: e.target.value })}
                placeholder="PC Admin 2"
              />
            </div>
            <div className="point-form-field">
              <label>PC Admin 3</label>
              <input
                type="text"
                value={editData.pcAdmin3 || ""}
                onChange={(e) => setEditData({ ...editData, pcAdmin3: e.target.value })}
                placeholder="PC Admin 3"
              />
            </div>
            <div className="point-form-field">
              <label>Tipo de Conexión</label>
              <select
                value={editData.tipoConexionCode || ""}
                onChange={(e) => setEditData({ ...editData, tipoConexionCode: e.target.value })}
              >
                <option value="">Seleccionar tipo de conexión</option>
                {tipoConexiones.map((tipo) => (
                  <option key={tipo.code} value={tipo.code}>
                    {tipo.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="point-form-field">
              <label>Zona</label>
              <select
                value={editData.zonaCode || ""}
                onChange={(e) => setEditData({ ...editData, zonaCode: e.target.value })}
              >
                <option value="">Seleccionar zona</option>
                {zonas.map((zona) => (
                  <option key={zona.code} value={zona.code}>
                    {zona.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="point-form-field">
              <label>Centro de Costo</label>
              <select
                value={editData.centroCostoCode || ""}
                onChange={(e) => setEditData({ ...editData, centroCostoCode: e.target.value })}
              >
                <option value="">Seleccionar centro de costo</option>
                {centrosCosto.map((centro) => (
                  <option key={centro.code} value={centro.code}>
                    {centro.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="point-form-field point-form-field-full">
              <label>Observación</label>
              <textarea
                value={editData.observacion || ""}
                onChange={(e) => setEditData({ ...editData, observacion: e.target.value })}
                placeholder="Observación"
                rows="3"
              />
            </div>
            <div className="point-form-field point-form-field-full">
              <label>Nota</label>
              <textarea
                value={editData.nota || ""}
                onChange={(e) => setEditData({ ...editData, nota: e.target.value })}
                placeholder="Nota"
                rows="3"
              />
            </div>
          </div>
          <div className="point-form-actions">
            <button className="point-cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button className="point-save-btn" onClick={onSave}>
              <FiSave /> Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PointEditForm
