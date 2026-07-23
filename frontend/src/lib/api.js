import axios from 'axios';

const apiInstance = axios.create({
    baseURL: '/api',
});

apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const api = {
    listVehicles: async () => {
        const response = await apiInstance.get('/vehicles/');
        // Backend returns { success: true, vehicles: [...] }
        return response.data.vehicles || [];
    },

    getVehicleById: async (id) => {
        const response = await apiInstance.get(`/vehicles/${id}`);
        return response.data.vehicle;
    },
    
    addVehicle: async (formData) => {
        // Send as multipart/form-data
        const response = await apiInstance.post('/vehicles/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.vehicle;
    },

    updateVehicle: async (id, data) => {
        // Can be JSON or multipart depending on if we update images
        const response = await apiInstance.put(`/vehicles/${id}`, data);
        return response.data.vehicle;
    },

    deleteVehicle: async (id) => {
        const response = await apiInstance.delete(`/vehicles/${id}`);
        return response.data;
    },

    restockVehicle: async (id, quantityToAdd) => {
        const response = await apiInstance.patch(`/vehicles/${id}/restock`, { quantityToAdd });
        return response.data.vehicle;
    },

    // Favorites API
    getFavorites: async () => {
        const response = await apiInstance.get('/users/favorites');
        return response.data.favorites;
    },

    toggleFavorite: async (vehicleId) => {
        const response = await apiInstance.post(`/users/favorites/${vehicleId}`);
        return response.data.favorites;
    }
};
