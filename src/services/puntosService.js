import { PUNTOS_GET_ALL } from './env';

import { PUNTOS_CREATE } from './env';

import { PUNTOS_UPDATE_BY_CODE } from './env';

import { PUNTOS_DELETE_BY_CODE } from './env';




export const getAllPoints = async (token) => {
    try {
      const response = await fetch(PUNTOS_GET_ALL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los puntos');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };






  export const createPoint = async (token, data) => {
    try {
      const response = await fetch(PUNTOS_CREATE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  
      if (!response.ok) {
        throw new Error('Error al crear el punto de venta')
      }
  
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  



export const updatePoint = async (token, code, data) => {
  try {
    const url = `${PUNTOS_UPDATE_BY_CODE}${code}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Error al modificar el punto de venta')
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}







  

export const deletePoint = async (token, code) => {
  try {
    const response = await fetch(`${PUNTOS_DELETE_BY_CODE}${code}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Si la respuesta es 204 No Content, no hay cuerpo para parsear.
    if (response.status === 204) {
      console.log(`Punto con código ${code} eliminado exitosamente (204 No Content).`)
      return true // Indica éxito sin necesidad de un cuerpo de respuesta
    }

    // Si la respuesta no es OK (y no es 204), intenta obtener un mensaje de error del cuerpo
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error desconocido" })) // Manejar si no hay JSON
      throw new Error(errorData.message || "Error al eliminar el punto")
    }

    // Para otras respuestas OK (ej. 200 con cuerpo), parsear el JSON
    return await response.json()
  } catch (error) {
    console.error("Error en deletePoint (servicio):", error)
    throw error
  }
}