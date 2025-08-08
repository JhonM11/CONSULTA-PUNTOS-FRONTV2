import { CCOSTO_GET_ALL } from './env';
import { CCOSTO_UPDATE } from './env';
import { CCOSTO_CREATE } from './env';



export const getAllCcosto = async (token) => {
    try {
      const response = await fetch(CCOSTO_GET_ALL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener centros de costos');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  



  export const createCcosto = async (token, name, zonaCode) => {
    try {
      const url = `${CCOSTO_CREATE}?name=${encodeURIComponent(name)}&zonaCode=${encodeURIComponent(zonaCode)}`;
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el centro de costo');
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  


  export const updateNameCcosto = async (token, code, newname) => {
    try {
      const url = `${CCOSTO_UPDATE}${code}?newName=${encodeURIComponent(newname)}`
  
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error("Error modificar el nombre del Centro de Costo")
      }
  
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  };
  