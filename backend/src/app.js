import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Temporary health-check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Car Dealership API is running"
    });
});

export default app;