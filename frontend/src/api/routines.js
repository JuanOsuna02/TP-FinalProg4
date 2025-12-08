import { api } from './client';

export const listRoutines = async () => {
  const { data } = await api.get('/api/rutinas');
  return data;
};

export const searchRoutines = async (name) => {
  const { data } = await api.get('/api/rutinas/buscar', { params: { nombre: name } });
  return data;
};

export const getRoutine = async (id) => {
  const { data } = await api.get(`/api/rutinas/${id}`);
  return data;
};

export const createRoutine = async (payload) => {
  const { data } = await api.post('/api/rutinas', payload);
  return data;
};

export const updateRoutine = async (id, payload) => {
  const { data } = await api.put(`/api/rutinas/${id}`, payload);
  return data;
};

export const deleteRoutine = async (id) => {
  await api.delete(`/api/rutinas/${id}`);
};



