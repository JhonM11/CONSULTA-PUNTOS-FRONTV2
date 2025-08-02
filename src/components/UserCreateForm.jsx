"use client"

import { useState } from "react"
import { FiX, FiSave } from "react-icons/fi"
import "../styles/user-form.css"

function UserCreateForm({ createData, setCreateData, onSave, onClose, roleOptions }) {
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!createData.username.trim()) newErrors.username = "El usuario es requerido."
    if (!createData.name.trim()) newErrors.name = "El nombre es requerido."
    if (!createData.lastname.trim()) newErrors.lastname = "El apellido es requerido."
    if (!createData.mail.trim()) {
      newErrors.mail = "El correo es requerido."
    } else if (!/\S+@\S+\.\S+/.test(createData.mail)) {
      newErrors.mail = "Formato de correo inválido."
    }
    if (!createData.roleId) newErrors.roleId = "El rol es requerido."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveClick = () => {
    if (validateForm()) {
      onSave()
    }
  }

  return (
    <div className="user-form-overlay">
      <div className="user-form">
        <div className="user-form-header">
          <span>Crear Usuario</span>
          <button className="user-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="user-form-body">
          <div className="user-form-grid">
            <div className="user-form-field">
              <label>Usuario *</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={createData.username}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "") // Elimina todo lo que no sea número
                  setCreateData({ ...createData, username: onlyNumbers })
                }}
                placeholder="Usuario - Documento"
                className={errors.username ? "input-error" : ""}
              />

              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>
            <div className="user-form-field">
              <label>Nombre</label>
              <input
                type="text"
                value={createData.name}
                onChange={(e) => setCreateData({ ...createData, name: e.target.value.toUpperCase() })}
                placeholder="Nombre"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="user-form-field">
              <label>Apellido</label>
              <input
                type="text"
                value={createData.lastname}
                onChange={(e) => setCreateData({ ...createData, lastname: e.target.value.toUpperCase() })}
                placeholder="Apellido"
                className={errors.lastname ? "input-error" : ""}
              />
              {errors.lastname && <p className="error-message">{errors.lastname}</p>}
            </div>
            <div className="user-form-field">
              <label>Correo</label>
              <input
                type="email"
                value={createData.mail}
                onChange={(e) => setCreateData({ ...createData, mail: e.target.value.toUpperCase() })}
                placeholder="Correo electrónico"
                className={errors.mail ? "input-error" : ""}
              />
              {errors.mail && <p className="error-message">{errors.mail}</p>}
            </div>
            <div className="user-form-field">
              <label>Rol *</label>
              <select
                value={createData.roleId}
                onChange={(e) => setCreateData({ ...createData, roleId: Number.parseInt(e.target.value) })}
                className={errors.roleId ? "input-error" : ""}
              >
                <option value="">Seleccionar rol</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.roleId && <p className="error-message">{errors.roleId}</p>}
            </div>
          </div>
          <div className="user-form-actions">
            <button className="user-cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button className="user-save-btn" onClick={handleSaveClick}>
              <FiSave /> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCreateForm
