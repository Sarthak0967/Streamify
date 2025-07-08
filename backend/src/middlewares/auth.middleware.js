import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import cookieParser from 'cookie-parser';

export const protectedRoute = async (req, res, next) => {
    
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({ message: "Unauthorized token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({ message: "Unauthorized (decoded)" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({ message: "Unauthorized (user)" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectedRoute middleware:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
