import { useState, useEffect } from "react";

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        try {
            const item = window.localStorage.getItem("autovault_favorites");
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error("Error reading localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem("autovault_favorites", JSON.stringify(favorites));
        } catch (error) {
            console.error("Error setting localStorage", error);
        }
    }, [favorites]);

    const toggleFavorite = (id) => {
        setFavorites((prev) => {
            if (prev.includes(id)) {
                return prev.filter((favId) => favId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const isFavorite = (id) => favorites.includes(id);

    return { favorites, toggleFavorite, isFavorite };
}
