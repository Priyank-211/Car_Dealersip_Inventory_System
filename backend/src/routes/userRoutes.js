import { Router } from "express";
import { getFavorites, toggleFavorite } from "../controller/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

// Get logged-in user's favorites
router.get("/favorites", authenticateUser, getFavorites);

// Toggle a favorite vehicle
router.post("/favorites/:vehicleId", authenticateUser, toggleFavorite);

export default router;
