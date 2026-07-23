import { vehicles as mockVehicles } from "../data/mockData.js";

// In-memory state for mock API
let vehicles = [...mockVehicles].map(v => ({
    ...v,
    quantity: v.quantity ?? Math.floor(Math.random() * 10) // Mock some quantities since our mockData doesn't have them
}));

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const api = {
    listVehicles: async () => {
        await delay(500); // Simulate network latency
        return vehicles;
    },
    
    deleteVehicle: async (id) => {
        await delay(400);
        const exists = vehicles.find(v => v.id === id);
        if (!exists) throw new Error("Vehicle not found");
        vehicles = vehicles.filter(v => v.id !== id);
        return { success: true };
    },

    restockVehicle: async (id, quantity) => {
        await delay(400);
        const index = vehicles.findIndex(v => v.id === id);
        if (index === -1) throw new Error("Vehicle not found");
        
        vehicles[index] = { ...vehicles[index], quantity };
        return vehicles[index];
    }
};
