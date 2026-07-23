import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, requireAdmin = false }) {
    const { user, loading } = useAuth();

    if (loading) return null; // or a loading spinner

    if (!user) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        // Logged in but not an admin, redirect to home page
        return <Navigate to="/" replace />;
    }

    // Authorized, render the route
    return children;
}
