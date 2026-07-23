import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
    {
        make: {
            type: String,
            required: [true, "Make is required"],
            trim: true
        },
        model: {
            type: String,
            required: [true, "Model is required"],
            trim: true
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity cannot be negative"]
        },
        images: {
            type: [String],
            required: [true, "At least 1 image is required"],
            validate: [
                { validator: (v) => v && v.length >= 1, message: "Minimum 1 image required" },
                { validator: (v) => v && v.length <= 5, message: "Maximum 5 images allowed" }
            ]
        }
    },
    {
        timestamps: true
    }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
