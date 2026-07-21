import request from "supertest";
import { describe, test, expect, beforeAll, afterAll, afterEach } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import app from "../../../src/app.js";
import User from "../../../src/models/user.js";

dotenv.config();

const TEST_DB_URI = process.env.MONGODB_URI.endsWith("/")
    ? process.env.MONGODB_URI + "jest_test_db"
    : process.env.MONGODB_URI.replace(/\/\?/, "/jest_test_db?");

beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /api/auth/login", () => {

    // 1. Successful login
    test("should login successfully with valid credentials", async () => {

        const hashedPassword = await bcrypt.hash("Password@123", 10);

        await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "Password@123"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    // 2. Missing email
    test("should reject login when email is missing", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                password: "Password@123"
            });

        expect(response.statusCode).toBe(400);
    });

    // 3. Missing password
    test("should reject login when password is missing", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com"
            });

        expect(response.statusCode).toBe(400);
    });

    // 4. Email does not exist
    test("should reject login when email does not exist", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "unknown@example.com",
                password: "Password@123"
            });

        expect(response.statusCode).toBe(401);
    });

    // 5. Incorrect password
    test("should reject login with incorrect password", async () => {

        const hashedPassword = await bcrypt.hash("Password@123", 10);

        await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "WrongPassword"
            });

        expect(response.statusCode).toBe(401);
    });

    // 6. Password should never be returned
    test("should not expose password in login response", async () => {

        const hashedPassword = await bcrypt.hash("Password@123", 10);

        await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "Password@123"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.user).not.toHaveProperty("password");
    });

    // 7. User details should be returned
    test("should return authenticated user details", async () => {

        const hashedPassword = await bcrypt.hash("Password@123", 10);

        await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword
        });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "Password@123"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.user.email).toBe("test@example.com");
        expect(response.body.user.role).toBe("user");
    });

});