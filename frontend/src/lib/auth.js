import axios from 'axios';

// Since we have a proxy configured in vite.config.js, we can just use /api
const api = axios.create({
    baseURL: '/api/auth',
});

// Add a request interceptor to automatically attach the token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

export const register = async (name, email, password) => {
    // The backend might expect 'name' or 'username'. Let's send 'name'.
    const response = await api.post('/register', { name, email, password });
    return response.data;
};
