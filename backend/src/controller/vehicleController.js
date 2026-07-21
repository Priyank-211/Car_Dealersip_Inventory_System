import Vehicle from "../models/vehicle.js";
import mongoose from "mongoose";

export const addVehicle = async (req, res) => {
    try {
        const { make, model, category, price, quantity } = req.body;

        // Validation for missing required fields
        if (!make || !model || !category || price === undefined || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Validation for invalid price and quantity
        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }
        
        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity cannot be negative"
            });
        }

        const vehicle = await Vehicle.create({
            make,
            model,
            category,
            price,
            quantity
        });

        return res.status(201).json({
            success: true,
            vehicle
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        return res.status(200).json({
            success: true,
            vehicles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID format"
            });
        }

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        return res.status(200).json({
            success: true,
            vehicle
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
