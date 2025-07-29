import { USER_SESSION_URL } from './env';
import { USER_CHANGE_PASSWD } from './env';

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
