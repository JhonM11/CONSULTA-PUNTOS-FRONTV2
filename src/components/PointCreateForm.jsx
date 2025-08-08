import { FiX, FiSave } from "react-icons/fi"
import "../styles/point-form.css"

function PointCreateForm({ createData, setCreateData, zonas, centrosCosto, tipoConexiones, onSave, onClose }) {
  // Helpers
  const strEq = (a, b) => String(a ?? "") === String(b ?? "")

  // Si hay un centro seleccionado, la zona debe quedar bloqueada a la zona de ese centro
  const selectedCentro = centrosCosto.find(c => strEq(c.code, createData.centroCostoCode))
  const forcedZonaCodeFromCentro = selectedCentro?.zonaCode

  // Opciones de zonas:
  // - Si hay centro seleccionado, solo mostramos su zona
  // - Si no, mostramos todas
  const availableZonas = forcedZonaCodeFromCentro
    ? zonas.filter(z => strEq(z.code, forcedZonaCodeFromCentro))
    : zonas

  // Opciones de centros:
  // - Si hay zona seleccionada (o forzada por el centro), filtramos por esa zona
  const effectiveZonaCode = forcedZonaCodeFromCentro ?? createData.zonaCode
  const availableCentros = effectiveZonaCode
    ? centrosCosto.filter(c => strEq(c.zonaCode, effectiveZonaCode))
    : centrosCosto

  const handleZonaChange = (e) => {
    const newZonaCode = e.target.value

    // Si el centro actual no pertenece a la nueva zona, lo limpiamos
    const centroOk = selectedCentro && strEq(selectedCentro.zonaCode, newZonaCode)
    setCreateData({
      ...createData,
      zonaCode: newZonaCode,
      centroCostoCode: centroOk ? createData.centroCostoCode : ""
    })
  }

  const handleCentroChange = (e) => {
    const newCentroCode = e.target.value
    const centro = centrosCosto.find(c => strEq(c.code, newCentroCode))
    const zonaDelCentro = centro?.zonaCode ? String(centro.zonaCode) : ""

    // Al elegir centro, forzamos la zona a la del centro
    setCreateData({
      ...createData,
      centroCostoCode: newCentroCode,
      zonaCode: zonaDelCentro
    })
  }

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
            {/* Código */}
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

            {/* Nombre */}
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

            {/* Tecnología */}
            <div className="point-form-field">
              <label>Tecnología</label>
              <input
                type="text"
                value={createData.tecnologia}
                onChange={(e) => setCreateData({ ...createData, tecnologia: e.target.value })}
                placeholder="Tecnología"
              />
            </div>

            {/* IPs / equipos (sin cambios)… */}
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

            {/* Tipo conexión */}
            <div className="point-form-field">
              <label>Tipo de Conexión</label>
              <select
                value={createData.tipoConexionCode}
                onChange={(e) => setCreateData({ ...createData, tipoConexionCode: e.target.value })}
              >
                <option value="">Seleccionar tipo de conexión</option>
                {tipoConexiones.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ZONA */}
            <div className="point-form-field">
              <label>Zona</label>
              <select
                value={createData.zonaCode}
                onChange={handleZonaChange}
              >
                <option value="">Seleccionar zona</option>
                {availableZonas.map((z) => (
                  <option key={z.code} value={z.code}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CENTRO DE COSTO */}
            <div className="point-form-field">
              <label>Centro de Costo</label>
              <select
                value={createData.centroCostoCode}
                onChange={handleCentroChange}
              >
                <option value="">Seleccionar centro de costo</option>
                {availableCentros.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Observación / Nota */}
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
