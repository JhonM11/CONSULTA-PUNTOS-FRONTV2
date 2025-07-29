/* ENDPOINT  BASE */
export const API_BASE_URL = "http://localhost:8080/api/v2/puntos";

/* ENDPOINT  AUTH */

export const USER_SESSION_URL = `${API_BASE_URL}/users/mysession`; 

/* ENDPOINT  USUARIOS */

export const USER_CHANGE_PASSWD = `${API_BASE_URL}/users/change-passwd/`; 

/* ENDPOINT CENTROS DE COSTOS */

export const CCOSTO_GET_ALL = `${API_BASE_URL}/centros-costos/list`;

export const CCOSTO_FIND_BY_CODE = `${API_BASE_URL}/centros-costos/findByCode/`;

export const CCOSTO_UPDATE = `${API_BASE_URL}/centros-costos/updateName/`;

export const CCOSTO_CREATE = `${API_BASE_URL}/centros-costos/create`;