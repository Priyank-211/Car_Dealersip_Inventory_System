import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Temporary health-check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Car Dealership API is running"
    });
});

export default app;