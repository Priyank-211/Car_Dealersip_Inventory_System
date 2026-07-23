import { Router } from "express";
import { getFavorites, toggleFavorite, getPurchases } from "../controller/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

// Get logged-in user's favorites
router.get("/favorites", authenticateUser, getFavorites);

// Toggle a favorite vehicle
router.post("/favorites/:vehicleId", authenticateUser, toggleFavorite);

// Get logged-in user's purchases
router.get("/purchases", authenticateUser, getPurchases);

export default router;
