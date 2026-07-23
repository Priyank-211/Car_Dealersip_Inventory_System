import User from "../models/user.js";

// Get user's favorite vehicle IDs
export const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            favorites: user.favorites || []
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Toggle a vehicle ID in user's favorites
export const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { vehicleId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isFavorite = user.favorites.includes(vehicleId);

        if (isFavorite) {
            // Remove from favorites
            user.favorites = user.favorites.filter(id => id.toString() !== vehicleId);
        } else {
            // Add to favorites
            user.favorites.push(vehicleId);
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: isFavorite ? "Removed from favorites" : "Added to favorites",
            favorites: user.favorites
        });
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
