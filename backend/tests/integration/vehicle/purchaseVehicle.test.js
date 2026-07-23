import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import app from "../../../src/app.js";
import Vehicle from "../../../src/models/vehicle.js";
import User from "../../../src/models/user.js";

dotenv.config();
const TEST_DB_URI = process.env.MONGODB_URI.endsWith("/")
    ? process.env.MONGODB_URI + "jest_test_db"
    : process.env.MONGODB_URI.replace(/\/\?/, "/jest_test_db?");

describe("POST /api/vehicles/:id/purchase", () => {
    let userToken;
    let standardUser;
    let testVehicleId;
    let outOfStockVehicleId;

    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URI);
    });

    beforeEach(async () => {
        await Vehicle.deleteMany({});
        await User.deleteMany({});
        
        // Use native MongoDB driver to clear purchases collection since model doesn't exist yet
        const collections = await mongoose.connection.db.listCollections({ name: 'purchases' }).toArray();
        if (collections.length > 0) {
            await mongoose.connection.db.collection('purchases').deleteMany({});
        }

        // 1. Create a standard user & token
        standardUser = await User.create({
            name: "Standard User",
            email: "user@example.com",
            password: "Password@123",
            role: "user",
        });
        userToken = jwt.sign(
            { id: standardUser._id, role: standardUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 2. Create a test vehicle to purchase
        const vehicle = await Vehicle.create({
            make: "Chevrolet",
            model: "Camaro",
            category: "Coupe",
            price: 35000,
            quantity: 5, // Starting with 5 in stock
            images: ["test-image.jpg"]
        });
        testVehicleId = vehicle._id.toString();

        // 3. Create an out of stock vehicle
        const outOfStockVehicle = await Vehicle.create({
            make: "Ford",
            model: "Mustang",
            category: "Coupe",
            price: 40000,
            quantity: 0, 
            images: ["test-image.jpg"]
        });
        outOfStockVehicleId = outOfStockVehicle._id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should successfully purchase an available vehicle and decrease quantity by 1", async () => {
        const res = await request(app)
            .post(`/api/vehicles/${testVehicleId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        // Verify quantity decreased by 1
        const updatedVehicle = await Vehicle.findById(testVehicleId);
        expect(updatedVehicle.quantity).toBe(4);
    });

    it("should create a Purchase record with correct fields upon successful purchase", async () => {
        const res = await request(app)
            .post(`/api/vehicles/${testVehicleId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);

        // Query native collection since model is not implemented yet
        const purchases = await mongoose.connection.db.collection('purchases').find({}).toArray();
        expect(purchases.length).toBe(1);

        const purchase = purchases[0];
        expect(purchase.user.toString()).toBe(standardUser._id.toString());
        expect(purchase.vehicle.toString()).toBe(testVehicleId);
        expect(purchase.priceAtPurchase).toBe(35000);
        expect(purchase.status).toBeDefined();
        expect(purchase.createdAt).toBeDefined();
    });

    it("should reject purchase when vehicle quantity is 0", async () => {
        const res = await request(app)
            .post(`/api/vehicles/${outOfStockVehicleId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(400); 
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/stock|quantity|available/i);

        // Verify quantity remains 0
        const updatedVehicle = await Vehicle.findById(outOfStockVehicleId);
        expect(updatedVehicle.quantity).toBe(0);
    });

    it("should reject purchase for a vehicle ID that does not exist", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .post(`/api/vehicles/${fakeId}/purchase`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Vehicle not found");
    });

    it("should reject purchase without a valid JWT token", async () => {
        const res = await request(app)
            .post(`/api/vehicles/${testVehicleId}/purchase`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});
