import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../../../src/app.js";
import Vehicle from "../../../src/models/vehicle.js";

dotenv.config();
const TEST_DB_URI = process.env.MONGODB_URI.endsWith("/")
    ? process.env.MONGODB_URI + "jest_test_db"
    : process.env.MONGODB_URI.replace(/\/\?/, "/jest_test_db?");

describe("GET /api/vehicles", () => {
    
    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URI);
    });

    beforeEach(async () => {
        await Vehicle.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe("Get all vehicles", () => {
        it("should return an empty array if no vehicles exist", async () => {
            const res = await request(app).get("/api/vehicles");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.vehicles).toEqual([]);
        });

        it("should return a list of vehicles successfully", async () => {
            // Seed the database
            await Vehicle.create([
                { make: "Toyota", model: "Camry", category: "Sedan", price: 25000, quantity: 5, images: ["/test.jpg"] },
                { make: "Honda", model: "Civic", category: "Sedan", price: 22000, quantity: 3, images: ["/test.jpg"] }
            ]);

            const res = await request(app).get("/api/vehicles");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.vehicles.length).toBe(2);
            expect(res.body.vehicles[0]).toHaveProperty("make");
            expect(res.body.vehicles[0]).toHaveProperty("price");
        });
    });

    describe("Get a single vehicle by ID", () => {
        it("should return a vehicle when a valid ID is provided", async () => {
            const newVehicle = await Vehicle.create({
                make: "Ford",
                model: "Mustang",
                category: "Coupe",
                price: 35000,
                quantity: 2,
                images: ["/test.jpg"]
            });

            const res = await request(app).get(`/api/vehicles/${newVehicle._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.vehicle.make).toBe("Ford");
            expect(res.body.vehicle.model).toBe("Mustang");
        });

        it("should return 404 when the vehicle is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/vehicles/${fakeId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Vehicle not found");
        });

        it("should return 400 when the ID format is invalid", async () => {
            const res = await request(app).get("/api/vehicles/invalid-id-format");

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Invalid vehicle ID format");
        });
    });
});