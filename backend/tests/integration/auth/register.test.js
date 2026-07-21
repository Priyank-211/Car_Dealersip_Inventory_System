import request from "supertest";
import { describe, test, expect, beforeAll, afterAll, afterEach } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../../../src/app.js";
import user from "../../../src/models/user.js";

dotenv.config();
// Connect to a separate test database
const TEST_DB_URI = process.env.MONGODB_URI.endsWith("/")
    ? process.env.MONGODB_URI + "jest_test_db"
    : process.env.MONGODB_URI.replace(/\/\?/, "/jest_test_db?");

beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);
});

beforeEach(async () => {
    await user.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});
describe("POST /api/auth/register", () => {

    // 1. Successful registration
    test("should register a user with valid details", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Password@123"
            });

        expect(response.statusCode).toBe(201);
    });


    // 2. Missing required fields
    test("should reject registration when required fields are missing", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com"
                // password intentionally missing
            });

        expect(response.statusCode).toBe(400);
    });


    // 3. Duplicate email
    test("should reject registration when email already exists", async () => {

        const userData = {
            name: "Test User",
            email: "duplicate@example.com",
            password: "Password@123"
        };

        // First registration
        await request(app)
            .post("/api/auth/register")
            .send(userData);

        // Attempt registration again
        const response = await request(app)
            .post("/api/auth/register")
            .send(userData);

        expect(response.statusCode).toBe(409);
    });


    // 4. Password should never be returned
    test("should not expose password in registration response", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Security Test",
                email: "security@example.com",
                password: "Password@123"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.user).not.toHaveProperty("password");
    });


    // 5. User should not be able to self-register as admin
    test("should not allow public registration to assign admin role", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Fake Admin",
                email: "fakeadmin@example.com",
                password: "Password@123",
                role: "admin"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.user.role).toBe("user");
    });

});