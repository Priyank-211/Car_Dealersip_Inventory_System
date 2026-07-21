import express from "express";
import { addVehicle } from "../controller/vehicleController.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("admin"), addVehicle);

export default router;
