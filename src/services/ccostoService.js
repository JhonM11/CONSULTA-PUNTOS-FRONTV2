import { CCOSTO_GET_ALL } from './env';
import { CCOSTO_FIND_BY_CODE } from './env';
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
  