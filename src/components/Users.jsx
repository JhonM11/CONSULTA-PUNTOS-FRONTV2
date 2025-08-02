"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiThumbsDown,
  FiThumbsUp,
  FiRotateCcw,
  FiShield,
  FiX,
  FiSave,
} from "react-icons/fi"
import {
  getAllUsers,
  activateUserByCode,
  inactivateUserByCode,
  resetUserPassword,
  updateUserRole,
  createUser,
} from "../services/userService"
import Notification from "./Notification"
import UserCreateForm from "./UserCreateForm"
import "../styles/users.css"

function Users() {
  const { token, role: currentUserRole } = useAuth()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ message: "", type: "" })
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUserForRole, setSelectedUserForRole] = useState(null)
  const [newRoleId, setNewRoleId] = useState("")
  const [isSubmittingRole, setIsSubmittingRole] = useState(false)

  const [showCreateUserForm, setShowCreateUserForm] = useState(false)
  const [newUserData, setNewUserData] = useState({
    username: "",
    name: "",
    lastname: "",
    mail: "",
    password: "",
    roleId: "",
  })

  const itemsPerPage = 5

  const roleOptions = [
    { id: 1, name: "ADMIN", label: "Administrador" },
    { id: 2, name: "AUXILIAR", label: "Auxiliar" },
    { id: 3, name: "COORDINADOR", label: "Coordinador" },
  ]

  const getRoleIdByName = (roleName) => {
    const option = roleOptions.find((opt) => opt.name === roleName)
    return option ? option.id : ""
  }

  const getRoleNameById = (roleId) => {
    const option = roleOptions.find((opt) => opt.id === roleId)
    return option ? option.name : ""
  }

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return
      setLoading(true)
      try {
        const data = await getAllUsers(token)
        setUsers(data)
        setFilteredUsers(data)
      } catch (err) {
        console.error("Error al cargar usuarios:", err)
        showNotification("Error al cargar los usuarios", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [token])

  useEffect(() => {
    const result = users.filter((user) => {
      const query = searchQuery.toLowerCase()
      return (
        user.codeuser?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query) ||
        user.name?.toLowerCase().includes(query) ||
        user.lastname?.toLowerCase().includes(query) ||
        user.mail?.toLowerCase().includes(query) ||
        user.state?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
      )
    })
    setFilteredUsers(result)
    setCurrentPage(1)
  }, [searchQuery, users])

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const getVisiblePages = () => {
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  const closeNotification = () => {
    setNotification({ message: "", type: "" })
  }

  const refreshUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllUsers(token)
      setUsers(data)
      setFilteredUsers(data)
    } catch (err) {
      console.error("Error al refrescar usuarios:", err)
      showNotification("Error al refrescar los usuarios", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleActivateInactivate = async (user, actionType) => {
    try {
      if (actionType === "activate") {
        await activateUserByCode(token, user.codeuser)
        showNotification(`Usuario ${user.username} activado exitosamente`, "success")
      } else {
        await inactivateUserByCode(token, user.codeuser)
        showNotification(`Usuario ${user.username} inactivado exitosamente`, "success")
      }
      await refreshUsers()
    } catch (err) {
      console.error(`Error al ${actionType} usuario:`, err)
      showNotification(`Error al ${actionType} el usuario`, "error")
    }
  }

  const handleResetPassword = async (user) => {
    try {
      await resetUserPassword(token, user.codeuser)
      showNotification(`Contraseña de ${user.username} restablecida exitosamente`, "success")
      await refreshUsers()
    } catch (err) {
      console.error("Error al restablecer contraseña:", err)
      showNotification("Error al restablecer la contraseña", "error")
    }
  }

  const handleOpenRoleModal = (user) => {
    setSelectedUserForRole(user)
    setNewRoleId(getRoleIdByName(user.role))
    setShowRoleModal(true)
  }

  const handleUpdateRole = async () => {
    if (!selectedUserForRole || !newRoleId) {
      showNotification("Selecciona un rol válido", "warning")
      return
    }
    setIsSubmittingRole(true)
    try {
      await updateUserRole(token, selectedUserForRole.codeuser, newRoleId)
      showNotification(`Rol de ${selectedUserForRole.username} actualizado exitosamente`, "success")
      setShowRoleModal(false)
      setSelectedUserForRole(null)
      setNewRoleId("")
      await refreshUsers()
    } catch (err) {
      console.error("Error al actualizar rol:", err)
      showNotification("Error al actualizar el rol", "error")
    } finally {
      setIsSubmittingRole(false)
    }
  }

  const handleCloseRoleModal = () => {
    setShowRoleModal(false)
    setSelectedUserForRole(null)
    setNewRoleId("")
  }

  // ✅ Aquí está el cambio principal
  const handleCreateUser = async () => {
    try {
      const roleName = getRoleNameById(newUserData.roleId)

      const dataToSend = {
        ...newUserData,
        role: roleName,
      }

      delete dataToSend.roleId

      await createUser(token, dataToSend)
      showNotification("Usuario creado exitosamente", "success")
      setShowCreateUserForm(false)
      setNewUserData({
        username: "",
        name: "",
        lastname: "",
        mail: "",
        password: "",
        roleId: "",
      })
      await refreshUsers()
    } catch (err) {
      console.error("Error al crear usuario:", err)
      showNotification(err.message || "Error al crear el usuario", "error")
    }
  }

  const handleCloseCreateUserForm = () => {
    setShowCreateUserForm(false)
    setNewUserData({
      username: "",
      name: "",
      lastname: "",
      mail: "",
      password: "",
      roleId: "",
    })
  }

  if (loading) {
    return (
      <div className="users-loading">
        <div className="users-loading-spinner"></div>
        <span>Cargando usuarios...</span>
      </div>
    )
  }

  return (
    <>
      <div className="users-container">
        <div className="users-title-header">
          <div className="users-title-content">
            <FiUsers className="users-title-icon" />
            <h2>Usuarios</h2>
          </div>
          {["ADMIN", "COORDINADOR"].includes(currentUserRole) && (
            <button
              className="users-create-btn"
              onClick={() => setShowCreateUserForm(true)}
              title="Crear nuevo usuario"
            >
              <FiUserPlus />
              Crear Usuario
            </button>
          )}
        </div>

        <div className="users-search-container">
          <div className="users-search-wrapper">
            <FiSearch className="users-search-icon" />
            <input
              type="text"
              placeholder="Buscar por código, usuario, nombre, apellido, correo, estado o rol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Código Usuario</th>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.codeuser}>
                  <td>{user.codeuser}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.lastname}</td>
                  <td>{user.mail}</td>
                  <td>{user.state === "A" ? "Activo" : "Inactivo"}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className="users-actions">
                      {["ADMIN", "COORDINADOR"].includes(currentUserRole) &&
                        (user.state === "A" ? (
                          <button
                            className="users-action-btn users-inactivate-btn"
                            title="Inactivar usuario"
                            onClick={() => handleActivateInactivate(user, "inactivate")}
                          >
                            <FiThumbsDown size={16} />
                          </button>
                        ) : (
                          <button
                            className="users-action-btn users-activate-btn"
                            title="Activar usuario"
                            onClick={() => handleActivateInactivate(user, "activate")}
                          >
                            <FiThumbsUp size={16} />
                          </button>
                        ))}

                      {["ADMIN", "COORDINADOR"].includes(currentUserRole) && (
                        <button
                          className="users-action-btn users-reset-btn"
                          title="Restablecer contraseña"
                          onClick={() => handleResetPassword(user)}
                        >
                          <FiRotateCcw size={16} />
                        </button>
                      )}
                      {["ADMIN", "COORDINADOR"].includes(currentUserRole) && (
                        <button
                          className="users-action-btn users-role-btn"
                          title="Cambiar rol"
                          onClick={() => handleOpenRoleModal(user)}
                        >
                          <FiShield size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="8" className="users-empty">
                    No hay resultados para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="users-pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="users-pagination-btn"
            >
              Anterior
            </button>
            <div className="users-pagination-numbers">
              {getVisiblePages().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`users-pagination-number ${currentPage === pageNum ? "active" : ""}`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="users-pagination-btn"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {showRoleModal && selectedUserForRole && (
        <div className="users-modal-overlay">
          <div className="users-modal">
            <div className="users-modal-header">
              <span>Editar Rol de {selectedUserForRole.username}</span>
              <button className="users-modal-close-btn" onClick={handleCloseRoleModal}>
                <FiX />
              </button>
            </div>
            <div className="users-modal-body">
              <div className="users-modal-field">
                <label className="users-modal-label">Nuevo Rol</label>
                <select
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(Number.parseInt(e.target.value))}
                  className="users-modal-select"
                  disabled={isSubmittingRole}
                >
                  <option value="">Seleccionar rol</option>
                  {roleOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="users-modal-actions">
                <button type="button" className="users-modal-cancel-btn" onClick={handleCloseRoleModal}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="users-modal-save-btn"
                  onClick={handleUpdateRole}
                  disabled={isSubmittingRole || !newRoleId}
                >
                  <FiSave />
                  {isSubmittingRole ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateUserForm && (
        <UserCreateForm
          createData={newUserData}
          setCreateData={setNewUserData}
          onSave={handleCreateUser}
          onClose={handleCloseCreateUserForm}
          roleOptions={roleOptions}
        />
      )}

      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  )
}

export default Users
