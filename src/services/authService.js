import { API_BASE_URL } from './env';

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    let errorMsg = 'Usuario o Contraseña inválidos';
    try {
      const error = await response.json();
      errorMsg = error.message || errorMsg;
    } catch {
      // Si la respuesta no es JSON, mantenemos el mensaje por defecto
    }
    throw new Error(errorMsg);
  }
  return response.json(); // { token }
} 