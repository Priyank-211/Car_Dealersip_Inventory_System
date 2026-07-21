import express from "express";
import { addVehicle } from "../controller/vehicleController.js";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeAdmin, addVehicle);

export default router;
