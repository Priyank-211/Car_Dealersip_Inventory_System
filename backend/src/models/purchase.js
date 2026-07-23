import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },
    priceAtPurchase: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "completed",
        enum: ["pending", "completed", "cancelled"]
    }
}, {
    timestamps: true
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
