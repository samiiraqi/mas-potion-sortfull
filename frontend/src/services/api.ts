import axios from 'axios';
import { Level } from '../types/game';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const gameAPI = {
  async getLevel(levelId: number): Promise<Level> {
    const response = await api.get(`/api/v1/levels/${levelId}`);
    return response.data;
  },
};

export default api;
