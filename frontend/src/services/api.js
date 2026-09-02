import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || '';
const api = axios.create({ baseURL: `${API_URL}/api/v1` });

export const searchByText = (data) => api.post('/search', data);
export const searchByFile = (formData) => api.post('/search/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getStandards = (params) => api.get('/standards', { params });
export const getStandardDetail = (id) => api.get(`/standards/${id}`);
export const getAlliedStandards = (id) => api.get(`/standards/${id}/allied`);
export const generateSpec = (data) => api.post('/specifications/generate', data);
export const exportSpec = (id, format) => api.get(`/specifications/${id}/export`, { params: { format }, responseType: 'blob' });
export const getAuditLogs = (params) => api.get('/audit', { params });
export const triggerSync = () => api.post('/sync/trigger');
export const getSyncStatus = () => api.get('/sync/status');
export default api;
