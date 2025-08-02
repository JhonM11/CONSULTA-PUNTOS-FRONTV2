/* ENDPOINT  BASE */
export const API_BASE_URL = "http://localhost:8080/api/v2/puntos";

/* ENDPOINT  AUTH */

export const USER_SESSION_URL = `${API_BASE_URL}/users/mysession`; 

/* ENDPOINT  USUARIOS */

export const USER_CHANGE_PASSWD = `${API_BASE_URL}/users/change-passwd/`; 

export const USER_CREATE = `${API_BASE_URL}/users/create`;

export const USER_GET_ALL = `${API_BASE_URL}/users/listUsers`;

export const USER_ACTIVATE_BY_CODE = `${API_BASE_URL}/users/activate/`;

export const USER_INNACTIVATE_BY_CODE = `${API_BASE_URL}/users/inactivate/`;

export const USER_RESET_PASSWD_BY_CODE = `${API_BASE_URL}/users/reset-password/`;

export const USER_UPDATE_ROLE_BY_CODE = `${API_BASE_URL}/users/update-role`;

/* ENDPOINT CENTROS DE COSTOS */

export const CCOSTO_GET_ALL = `${API_BASE_URL}/centros-costos/list`;

export const CCOSTO_FIND_BY_CODE = `${API_BASE_URL}/centros-costos/findByCode/`;

export const CCOSTO_UPDATE = `${API_BASE_URL}/centros-costos/updateName/`;

export const CCOSTO_CREATE = `${API_BASE_URL}/centros-costos/create`;


/* ENDPOINT ZONAS */

export const ZONA_GET_ALL = `${API_BASE_URL}/zonas/getAll`;

export const ZONA_CREATE = `${API_BASE_URL}/zonas/create`;

export const ZONA_UPDATE_NAME = `${API_BASE_URL}/zonas/updateName/`;

export const ZONA_UPDATE_BY_CODE = `${API_BASE_URL}/zonas/findByCode/`;


/* ENDPOINT TIPO CONEXIONES */

export const TCONEXIONES_GET_ALL = `${API_BASE_URL}/tipo-conexiones/getAllConnection`;

export const TCONEXIONES_CREATE = `${API_BASE_URL}/tipo-conexiones/createTypeConnection`;

export const TCONEXIONES_UPDATE_NAME = `${API_BASE_URL}/tipo-conexiones/updateTypeConnectionByCode/`;


/* ENDPOINT PUNTOS */


export const PUNTOS_GET_ALL = `${API_BASE_URL}/list`;

export const PUNTOS_CREATE = `${API_BASE_URL}/create`;

export const PUNTOS_UPDATE_BY_CODE = `${API_BASE_URL}/update/`;

export const PUNTOS_DELETE_BY_CODE = `${API_BASE_URL}/delete/`;



/*SECCION DE REPORTES*/

export const PUNTOS_REPORTS_FORMAT_EXCEL = `${API_BASE_URL}/reports`;

export const PUNTOS_REPORTS_FORMAT_ANSIBLE = `${API_BASE_URL}/reports-FormatAnsible`;

/*SECCION DE CARGA DE ARCHIVOS*/

export const PUNTOS_LOAD_FILE = `${API_BASE_URL}/upload-excel`;

/*SECCION DE DESCARGA DE PLANTILLAS*/

export const PUNTOS_DOWNLOAD_TEMPLATE = `${API_BASE_URL}/download-template`;

