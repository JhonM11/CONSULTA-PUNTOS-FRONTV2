import { USER_SESSION_URL } from './env';

export async function getUserSession(token) {
  const res = await fetch(USER_SESSION_URL, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No se pudo obtener la sesión de usuario');
  return res.json();
} 