import Vehicle from "../models/vehicle.js";
import Purchase from "../models/purchase.js";
import mongoose from "mongoose";

export const addVehicle = async (req, res) => {
    try {
        const { make, model, category, price, quantity } = req.body;

        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path || file.originalname);
        }

        // Validation for missing required fields
        if (!make || !model || !category || price === undefined || quantity === undefined || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields including at least 1 image"
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
            quantity,
            images
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

export const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (req.files && req.files.length > 0) {
            updates.images = req.files.map(file => file.path || file.originalname);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID format"
            });
        }

        // Validate that price or quantity (if being updated) are not negative
        if (updates.price !== undefined && updates.price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }
        if (updates.quantity !== undefined && updates.quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity cannot be negative"
            });
        }

        const vehicle = await Vehicle.findByIdAndUpdate(id, updates, {
            returnDocument: "after", // Return the updated document
            runValidators: true // Enforce model validations
        });

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

export const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID format"
            });
        }

        const vehicle = await Vehicle.findByIdAndDelete(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle removed"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const restockVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantityToAdd } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID format"
            });
        }

        if (quantityToAdd === undefined || quantityToAdd <= 0 || typeof quantityToAdd !== 'number') {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid quantity to add (must be greater than 0)"
            });
        }

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        vehicle.quantity += quantityToAdd;
        await vehicle.save();

        return res.status(200).json({
            success: true,
            message: "Vehicle restocked successfully",
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

export const purchaseVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // From authMiddleware

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

        if (vehicle.quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Vehicle is out of stock / quantity not available"
            });
        }

        // Decrement stock
        vehicle.quantity -= 1;
        await vehicle.save();

        // Create Purchase record
        const purchase = await Purchase.create({
            user: userId,
            vehicle: vehicle._id,
            priceAtPurchase: vehicle.price,
            status: "completed"
        });

        return res.status(200).json({
            success: true,
            message: "Vehicle purchased successfully",
            purchase
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
