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

describe("PATCH /api/vehicles/:id/restock", () => {
    let adminToken;
    let userToken;
    let testVehicleId;

    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URI);
    });

    beforeEach(async () => {
        await Vehicle.deleteMany({});
        await User.deleteMany({});

        // 1. Create an admin user & token
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "Password@123",
            role: "admin",
        });
        adminToken = jwt.sign(
            { id: adminUser._id, role: adminUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 2. Create a standard user & token
        const standardUser = await User.create({
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

        // 3. Create a test vehicle to restock
        const vehicle = await Vehicle.create({
            make: "Chevrolet",
            model: "Camaro",
            category: "Coupe",
            price: 35000,
            quantity: 5, // Starting with 5 in stock
        });
        testVehicleId = vehicle._id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should successfully add to the vehicle's stock when an admin token is provided", async () => {
        const res = await request(app)
            .patch(`/api/vehicles/${testVehicleId}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantityToAdd: 10 }); // Adding 10

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.vehicle.quantity).toBe(15); // 5 + 10 = 15
        expect(res.body.message).toBe("Vehicle restocked successfully");
    });

    it("should return 401 when token is missing", async () => {
        const res = await request(app)
            .patch(`/api/vehicles/${testVehicleId}/restock`)
            .send({ quantityToAdd: 10 });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should return 403 when a non-admin user attempts to restock", async () => {
        const res = await request(app)
            .patch(`/api/vehicles/${testVehicleId}/restock`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantityToAdd: 10 });

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User role is not authorized to access this route");
    });

    it("should return 400 when quantityToAdd is missing or invalid", async () => {
        const res1 = await request(app)
            .patch(`/api/vehicles/${testVehicleId}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({}); // Missing quantityToAdd

        expect(res1.statusCode).toBe(400);
        expect(res1.body.success).toBe(false);

        const res2 = await request(app)
            .patch(`/api/vehicles/${testVehicleId}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantityToAdd: -5 }); // Negative quantityToAdd

        expect(res2.statusCode).toBe(400);
        expect(res2.body.success).toBe(false);
        expect(res2.body.message).toBe("Please provide a valid quantity to add (must be greater than 0)");
    });

    it("should return 404 when the vehicle does not exist", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .patch(`/api/vehicles/${fakeId}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantityToAdd: 10 });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Vehicle not found");
    });

    it("should return 400 when the ID format is invalid", async () => {
        const res = await request(app)
            .patch("/api/vehicles/invalid-id-format/restock")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantityToAdd: 10 });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid vehicle ID format");
    });
});
