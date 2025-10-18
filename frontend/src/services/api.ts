import axios from 'axios';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
});

export const gameAPI = {
  getLevel: async (levelId: number) => {
    const response = await api.get(`/api/v1/levels/${levelId}`);
    return response.data;
  },
};
