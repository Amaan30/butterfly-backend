"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
//middleware/auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../model/user"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const authMiddleware = async (req, res, next) => {
    // Extract token from cookies
    const token = req.cookies.token;
    // if no token exists return unauthorized
    if (!token) {
        res.status(401).json({ message: 'no token provided' });
        return;
    }
    try {
        //verify token validity
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // Only check for _id or id
        // Fetch the full user document
        const user = await user_1.default.findById(decoded._id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Attach full user document to request
        req.user = user;
        next();
    }
    catch (err) {
        // Include error details in response
        const errorMessage = err instanceof Error ? err.message : 'Invalid token';
        res.status(401).json({ message: errorMessage });
    }
};
exports.authMiddleware = authMiddleware;
