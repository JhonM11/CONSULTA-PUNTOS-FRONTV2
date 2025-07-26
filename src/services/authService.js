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
    const error = await response.json();
    throw new Error(error.message || 'Error de autenticación');
  }
  return response.json(); // { token }
} 