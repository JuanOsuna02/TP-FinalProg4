import axios from 'axios';

// Base URL configurable por .env; fallback local
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Instancia Axios compartida para la API
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});




