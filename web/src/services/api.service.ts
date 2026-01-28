import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    },

    register: async (email: string, password: string, name: string) => {
        return api.post('/auth/register', { email, password, name });
    },

    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data: any) => {
        const response = await api.patch('/users/profile', data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
};

export const leadsService = {
    create: async (url: string) => {
        const response = await api.post('/leads', { url });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/leads/stats');
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/leads');
        return response.data;
    }
};
