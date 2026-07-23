import express from "express";
import { addVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle, restockVehicle } from "../controller/vehicleController.js";
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("admin"), upload.array('images', 5), addVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.put("/:id", authenticateUser, authorizeRoles("admin"), upload.array('images', 5), updateVehicle);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteVehicle);
router.patch("/:id/restock", authenticateUser, authorizeRoles("admin"), restockVehicle);

export default router;
