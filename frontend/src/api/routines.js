import { api } from './client';

// Listado con filtros/paginación
export const listRoutines = async (filters = {}) => {
  const { data } = await api.get('/api/rutinas', { params: filters });
  return data; // { items, total, page, size }
};

// Búsqueda específica
export const searchRoutines = async (name, day) => {
  const { data } = await api.get('/api/rutinas/buscar', { params: { nombre: name, dia: day } });
  return data;
};

// Detalle por id
export const getRoutine = async (id) => {
  const { data } = await api.get(`/api/rutinas/${id}`);
  return data;
};

// Alta de rutina
export const createRoutine = async (payload) => {
  const { data } = await api.post('/api/rutinas', payload);
  return data;
};

// Edición de rutina
export const updateRoutine = async (id, payload) => {
  const { data } = await api.put(`/api/rutinas/${id}`, payload);
  return data;
};

// Baja de rutina
export const deleteRoutine = async (id) => {
  await api.delete(`/api/rutinas/${id}`);
};

// Duplica rutina
export const duplicateRoutine = async (id) => {
  const { data } = await api.post(`/api/rutinas/${id}/duplicar`);
  return data;
};

// Exporta CSV/PDF (devuelve blob)
export const exportRoutines = async (format = 'csv') => {
  const response = await api.get('/api/rutinas/export', {
    params: { format },
    responseType: 'blob',
  });
  return response.data;
};

// Estadísticas resumidas
export const getStats = async () => {
  const { data } = await api.get('/api/rutinas/stats');
  return data;
};



