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

describe("DELETE /api/vehicles/:id", () => {
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

        // 3. Create a test vehicle to delete
        const vehicle = await Vehicle.create({
            make: "Ford",
            model: "F-150",
            category: "Truck",
            price: 45000,
            quantity: 2,
        });
        testVehicleId = vehicle._id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should delete a vehicle successfully when an admin token is provided", async () => {
        const res = await request(app)
            .delete(`/api/vehicles/${testVehicleId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Vehicle removed");

        // Verify it was actually removed from the database
        const vehicleInDb = await Vehicle.findById(testVehicleId);
        expect(vehicleInDb).toBeNull();
    });

    it("should return 401 when token is missing", async () => {
        const res = await request(app)
            .delete(`/api/vehicles/${testVehicleId}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should return 403 when a non-admin user attempts to delete a vehicle", async () => {
        const res = await request(app)
            .delete(`/api/vehicles/${testVehicleId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User role is not authorized to access this route");
    });

    it("should return 404 when the vehicle does not exist", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/vehicles/${fakeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Vehicle not found");
    });

    it("should return 400 when the ID format is invalid", async () => {
        const res = await request(app)
            .delete("/api/vehicles/invalid-id-format")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid vehicle ID format");
    });
});
