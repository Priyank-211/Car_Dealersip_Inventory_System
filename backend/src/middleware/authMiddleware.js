import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Return early if there is no valid Bearer token
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this route",
            });
        }

        // Extract and verify token
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "User role is not authorized to access this route",
            });
        }
        next();
    };
};
