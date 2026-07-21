import express from "express";
import { addVehicle, getVehicles, getVehicleById } from "../controller/vehicleController.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("admin"), addVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

export default router;
