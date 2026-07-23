import express from "express";
import cors from "cors";
import multer from "multer";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/users", userRoutes);

// Temporary health-check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Car Dealership API is running"
    });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ success: false, message: 'Too many files uploaded' });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
});

export default app;