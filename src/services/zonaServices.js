import { ZONA_GET_ALL } from './env';
import { ZONA_CREATE } from './env';
import { ZONA_UPDATE_NAME } from './env';



export const getAllZonas = async (token) => {
    try {
      const response = await fetch(ZONA_GET_ALL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener Zonas');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  



  export const createZona = async (token, name) => {
    try {
      const url = `${ZONA_CREATE}?name=${encodeURIComponent(name)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la zona');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  


  export const updateNameZona = async (token, code, newname) => {
    try {
      const url = `${ZONA_UPDATE_NAME}${code}?newName=${encodeURIComponent(newname)}`
  
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Error modificar el nombre de la zona")
      }
  
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  };
  