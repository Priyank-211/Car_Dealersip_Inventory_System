import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//User registration functionality
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,

        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

};

//User Login functionality
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        const existingUser = await user.findOne({ email }).select("+password");
        if (!existingUser) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET || "testsecret",
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};