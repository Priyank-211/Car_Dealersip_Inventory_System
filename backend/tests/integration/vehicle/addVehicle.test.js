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
        const dummyImage = Buffer.from("fake image content");

        it("should add a vehicle successfully", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .field("make", "Toyota")
                .field("model", "Camry")
                .field("category", "Sedan")
                .field("price", 25000)
                .field("quantity", 10)
                .attach("images", dummyImage, "image1.jpg");

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

    describe("Add Vehicle - Image Uploads", () => {
        const dummyImage = Buffer.from("fake image content");

        it("should successfully add a vehicle with exactly 1 image (min boundary)", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .field("make", "BMW")
                .field("model", "M4 Competition")
                .field("category", "Coupe")
                .field("price", 153000)
                .field("quantity", 3)
                .attach("images", dummyImage, "image1.jpg");

            expect(res.statusCode).toBe(201);
            expect(res.body.vehicle.images).toBeDefined();
            expect(res.body.vehicle.images.length).toBe(1);
        });

        it("should successfully add a vehicle with exactly 5 images (max boundary)", async () => {
            const req = request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .field("make", "BMW")
                .field("model", "M4 Competition")
                .field("category", "Coupe")
                .field("price", 153000)
                .field("quantity", 3);

            for (let i = 0; i < 5; i++) {
                req.attach("images", dummyImage, `image${i}.jpg`);
            }

            const res = await req;

            expect(res.statusCode).toBe(201);
            expect(res.body.vehicle.images).toBeDefined();
            expect(res.body.vehicle.images.length).toBe(5);
        });

        it("should return 400 if 0 images are provided", async () => {
            const res = await request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .field("make", "BMW")
                .field("model", "M4")
                .field("category", "Coupe")
                .field("price", 153000)
                .field("quantity", 3);
            
            // Note: Not attaching any 'images'
            expect(res.statusCode).toBe(400);
        });

        it("should return 400 if more than 5 images are provided", async () => {
            const req = request(app)
                .post("/api/vehicles")
                .set("Authorization", `Bearer ${token}`)
                .field("make", "BMW")
                .field("model", "M4 Competition")
                .field("category", "Coupe")
                .field("price", 153000)
                .field("quantity", 3);

            for (let i = 0; i < 6; i++) {
                req.attach("images", dummyImage, `image${i}.jpg`);
            }

            const res = await req;

            expect(res.statusCode).toBe(400);
        });
    });
});