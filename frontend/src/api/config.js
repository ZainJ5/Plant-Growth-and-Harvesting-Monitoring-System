/**
 * Shared API configuration for backend requests.
 * Set VITE_API_URL in .env for production (e.g. VITE_API_URL=https://api.your app.com).
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Returns headers object including Authorization Bearer token when user is logged in.
 * Use for requests that require authentication.
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Full headers for JSON requests (e.g. login, signup).
 */
export function jsonHeaders(includeAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...(includeAuth ? getAuthHeaders() : {}),
  };
  return headers;
}
