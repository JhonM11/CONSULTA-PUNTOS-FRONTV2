import { FiX, FiSave } from "react-icons/fi"
import "../styles/point-form.css"

function PointCreateForm({ createData, setCreateData, zonas, centrosCosto, tipoConexiones, onSave, onClose }) {
  return (
    <div className="point-form-overlay">
      <div className="point-form">
        <div className="point-form-header">
          <span>Crear Punto</span>
          <button className="point-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="point-form-body">
          <div className="point-form-grid">
            {/* Nuevo campo para el Código */}
            <div className="point-form-field">
              <label>Código *</label>
              <input
                type="text"
                value={createData.codigo}
                onChange={(e) => setCreateData({ ...createData, codigo: e.target.value })}
                placeholder="Código del punto"
                required
              />
            </div>
            <div className="point-form-field">
              <label>Nombre *</label>
              <input
                type="text"
                value={createData.nombre}
                onChange={(e) => setCreateData({ ...createData, nombre: e.target.value })}
                placeholder="Nombre del punto"
                required
              />
            </div>
            <div className="point-form-field">
              <label>Tecnología</label>
              <input
                type="text"
                value={createData.tecnologia}
                onChange={(e) => setCreateData({ ...createData, tecnologia: e.target.value })}
                placeholder="Tecnología"
              />
            </div>
            <div className="point-form-field">
              <label>IP Radio</label>
              <input
                type="text"
                value={createData.ipRadio}
                onChange={(e) => setCreateData({ ...createData, ipRadio: e.target.value })}
                placeholder="IP Radio"
              />
            </div>
            <div className="point-form-field">
              <label>IP Teléfono</label>
              <input
                type="text"
                value={createData.ipTelefono}
                onChange={(e) => setCreateData({ ...createData, ipTelefono: e.target.value })}
                placeholder="IP Teléfono"
              />
            </div>
            <div className="point-form-field">
              <label>PC Venta</label>
              <input
                type="text"
                value={createData.pcVenta}
                onChange={(e) => setCreateData({ ...createData, pcVenta: e.target.value })}
                placeholder="PC Venta"
              />
            </div>
            <div className="point-form-field">
              <label>Raspberry</label>
              <input
                type="text"
                value={createData.raspberry}
                onChange={(e) => setCreateData({ ...createData, raspberry: e.target.value })}
                placeholder="Raspberry"
              />
            </div>
            <div className="point-form-field">
              <label>RBetplay</label>
              <input
                type="text"
                value={createData.rbetplay}
                onChange={(e) => setCreateData({ ...createData, rbetplay: e.target.value })}
                placeholder="RBetplay"
              />
            </div>
            <div className="point-form-field">
              <label>DVR</label>
              <input
                type="text"
                value={createData.dvr}
                onChange={(e) => setCreateData({ ...createData, dvr: e.target.value })}
                placeholder="DVR"
              />
            </div>
            <div className="point-form-field">
              <label>PC Admin 1</label>
              <input
                type="text"
                value={createData.pcAdmin1}
                onChange={(e) => setCreateData({ ...createData, pcAdmin1: e.target.value })}
                placeholder="PC Admin 1"
              />
            </div>
            <div className="point-form-field">
              <label>PC Admin 2</label>
              <input
                type="text"
                value={createData.pcAdmin2}
                onChange={(e) => setCreateData({ ...createData, pcAdmin2: e.target.value })}
                placeholder="PC Admin 2"
              />
            </div>
            <div className="point-form-field">
              <label>PC Admin 3</label>
              <input
                type="text"
                value={createData.pcAdmin3}
                onChange={(e) => setCreateData({ ...createData, pcAdmin3: e.target.value })}
                placeholder="PC Admin 3"
              />
            </div>
            <div className="point-form-field">
              <label>Tipo de Conexión</label>
              <select
                value={createData.tipoConexionCode}
                onChange={(e) => setCreateData({ ...createData, tipoConexionCode: e.target.value })}
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
                value={createData.zonaCode}
                onChange={(e) => setCreateData({ ...createData, zonaCode: e.target.value })}
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
                value={createData.centroCostoCode}
                onChange={(e) => setCreateData({ ...createData, centroCostoCode: e.target.value })}
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
                value={createData.observacion}
                onChange={(e) => setCreateData({ ...createData, observacion: e.target.value })}
                placeholder="Observación"
                rows="3"
              />
            </div>
            <div className="point-form-field point-form-field-full">
              <label>Nota</label>
              <textarea
                value={createData.nota}
                onChange={(e) => setCreateData({ ...createData, nota: e.target.value })}
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
              <FiSave /> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PointCreateForm
