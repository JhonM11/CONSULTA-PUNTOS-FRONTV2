import { USER_SESSION_URL } from './env';
import { USER_CHANGE_PASSWD } from './env';
import { USER_CREATE } from './env';
import { USER_GET_ALL } from './env';
import { USER_ACTIVATE_BY_CODE } from './env';
import { USER_INNACTIVATE_BY_CODE } from './env';
import { USER_RESET_PASSWD_BY_CODE } from './env';
import { USER_UPDATE_ROLE_BY_CODE } from './env';





export async function getUserSession(token) {
  const res = await fetch(USER_SESSION_URL, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No se pudo obtener la sesión de usuario');
  return res.json();
} 



// services/userService.js

export async function changePassword(codeuser, currentPassword, newPassword, token) {
  const res = await fetch(`${USER_CHANGE_PASSWD}${codeuser}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword, 
      newPassword,      
    }),
  });

  if (!res.ok) {
    const errorResponse = await res.json(); // Esto asume que el error viene en formato JSON
    throw new Error(errorResponse.error || 'Error desconocido'); // Lanza un error con el mensaje de error
  }

  const data = await res.json();
  return data;  // Devuelve los datos de la respuesta, que pueden incluir un mensaje de éxito
}



export const createUser = async (token, data) => {
  try {
    const response = await fetch(USER_CREATE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error al crear usuario')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}




// Obtener todos los usuarios
export const getAllUsers = async (token) => {
  try {
    const response = await fetch(USER_GET_ALL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener los usuarios')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}


// Activar usuario por código
export const activateUserByCode = async (token, codeuser) => {
  try {
    const url = `${USER_ACTIVATE_BY_CODE}${codeuser}`

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al activar el usuario')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}


// Inactivar usuario por código
export const inactivateUserByCode = async (token, codeuser) => {
  try {
    const url = `${USER_INNACTIVATE_BY_CODE}${codeuser}`

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al inactivar el usuario')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}


// Restablecer contraseña por código de usuario
export const resetUserPassword = async (token, codeuser) => {
  try {
    const url = `${USER_RESET_PASSWD_BY_CODE}${codeuser}`

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al restablecer la contraseña del usuario')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}


// Actualizar rol de usuario
export const updateUserRole = async (token, codeuser, roleId) => {
  try {
    // Construye la URL incluyendo ambos parámetros
    const url = `${USER_UPDATE_ROLE_BY_CODE}?codeuser=${codeuser}&roleId=${roleId}`

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al actualizar el rol del usuario')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}

