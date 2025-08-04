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
      const data = await response.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      // Si por alguna razón no es JSON, se mantiene mensaje por defecto
    }
  
    throw new Error(errorMsg);
  }
  
  return response.json(); // { token }
} 