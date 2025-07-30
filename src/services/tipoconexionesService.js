import { TCONEXIONES_GET_ALL } from './env';
import { TCONEXIONES_CREATE } from './env';
import { TCONEXIONES_UPDATE_NAME } from './env';



export const getAllTipoConexiones = async (token) => {
    try {
      const response = await fetch(TCONEXIONES_GET_ALL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los tipo conexiones');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  

  


  export const createTipoConexion = async (token, name) => {
    try {
      const url = `${TCONEXIONES_CREATE}`
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
  
      if (!response.ok) {
        throw new Error('Error al crear el tipo de conexión')
      }
  
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  



  



  export const updateNameTipoConexion = async (token, code, newname) => {
    try {
      const url = `${TCONEXIONES_UPDATE_NAME}${code}?newName=${encodeURIComponent(newname)}`
  
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Error al modificar el nombre del tipo de conexión")
      }
  
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  };
  