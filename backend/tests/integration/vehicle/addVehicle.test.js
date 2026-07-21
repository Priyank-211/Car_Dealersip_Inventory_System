import request from "supertest";
import mongoose from "mongoose";
import app from "../../../src/app.js";
import User from "../../../src/models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const TEST_DB_URI = process.env.MONGODB_URI.endsWith("/")
    ? process.env.MONGODB_URI + "jest_test_db"
    : process.env.MONGODB_URI.replace(/\/\?/, "/jest_test_db?");

describe("POST /api/vehicles", () => {
    let token;

    beforeAll(async () => {
        await mongoose.connect(TEST_DB_URI);
    });

    beforeEach(async () => {
        await User.deleteMany({});

        const user = await User.create({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
            role: "admin",
        });

        token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe("Add Vehicle", () => {
        it("should add a vehicle successfully", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    make: "Toyota",
                    model: "Camry",
                    category: "Sedan",
                    price: 25000,
                    quantity: 10,
                });

            expect(res.statusCode).toBe(201);
        });

        it("should return 401 when token is missing", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .send({
                    make: "Toyota",
                    model: "Camry",
                    category: "Sedan",
                    price: 25000,
                    quantity: 10,
                });

            expect(res.statusCode).toBe(401);
        });

        it("should return 401 when token is invalid", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .set("Authorization", "Bearer invalidtoken")
                .send({
                    make: "Toyota",
                    model: "Camry",
                    category: "Sedan",
                    price: 25000,
                    quantity: 10,
                });

            expect(res.statusCode).toBe(401);
        });

        it("should return 400 when required fields are missing", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    make: "Toyota",
                });

            expect(res.statusCode).toBe(400);
        });

        it("should return 400 when price is invalid", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    make: "Toyota",
                    model: "Camry",
                    category: "Sedan",
                    price: -100,
                    quantity: 10,
                });

            expect(res.statusCode).toBe(400);
        });

        it("should return 400 when quantity is invalid", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    make: "Toyota",
                    model: "Camry",
                    category: "Sedan",
                    price: 25000,
                    quantity: -5,
                });

            expect(res.statusCode).toBe(400);
        });
    });
});