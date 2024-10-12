import api from './api';

export const login = (data) => api.post('/login', data, { withCredentials: true });

export const register = (data) => api.post('/register', data, { withCredentials: true });

export const getNotesByUserId = (userId) => api.get(`/notes/user/${userId}`);

export const getNoteById = (noteId) => api.get(`/notes/${noteId}`);

export const createNote = (data) => api.post('/notes', data);

export const updateNote = (noteId, data) => api.put(`/notes/${noteId}`, data);

export const deleteNote = (noteId) => api.delete(`/notes/${noteId}`);

export const searchNotes = (query) => api.get(`/notes/search?keyword=${query}`);

export const getNoteHistory = (noteId) => api.get(`/noteHistory/${noteId}`);

export const getCaptchaImage = () => api.get('/captchaImage', { withCredentials: true });