import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export function useFavorites() {
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch favorites from the backend on load/login
    useEffect(() => {
        let isMounted = true;
        
        const fetchFavorites = async () => {
            if (user) {
                try {
                    const data = await api.getFavorites();
                    if (isMounted) setFavorites(data);
                } catch (error) {
                    console.error("Failed to fetch favorites:", error);
                }
            } else {
                if (isMounted) setFavorites([]); // Clear favorites if logged out
            }
        };

        fetchFavorites();
        
        return () => {
            isMounted = false;
        };
    }, [user]);

    const toggleFavorite = async (id) => {
        if (!user) {
            // Require login to favorite
            navigate("/login");
            return;
        }

        // Optimistic update
        setFavorites((prev) => {
            if (prev.includes(id)) {
                return prev.filter((favId) => favId !== id);
            } else {
                return [...prev, id];
            }
        });

        // Background update
        try {
            await api.toggleFavorite(id);
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            // Revert optimistic update if API call fails
            setFavorites((prev) => {
                if (prev.includes(id)) {
                    return prev.filter((favId) => favId !== id);
                } else {
                    return [...prev, id];
                }
            });
        }
    };

    const isFavorite = (id) => favorites.includes(id);

    return { favorites, toggleFavorite, isFavorite };
}
