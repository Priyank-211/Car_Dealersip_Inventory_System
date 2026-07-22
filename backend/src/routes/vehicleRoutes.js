import express from "express";
import { addVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle } from "../controller/vehicleController.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("admin"), addVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.put("/:id", authenticateUser, authorizeRoles("admin"), updateVehicle);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteVehicle);

export default router;
