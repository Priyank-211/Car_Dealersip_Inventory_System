import request from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../../../src/app.js";

//When a user sends valid registration details to POST /api/auth/register, the API should return HTTP 201 Created. testing a registration 
describe("POST /api/auth/register", () => {

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

});