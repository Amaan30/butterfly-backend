"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
//middleware/auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const authMiddleware = (req, res, next) => {
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
        // Check if the decoded token matches the User interface
        if (typeof decoded === 'object' && decoded !== null &&
            'username' in decoded && 'name' in decoded && 'email' in decoded) {
            // Attach user data to request
            req.user = {
                _id: decoded.id,
                username: decoded.username,
                name: decoded.name,
                email: decoded.email
            };
        }
        else {
            throw new Error('Invalid token structure');
        }
        // Continue to the next middleware or route handler
        next();
    }
    catch (err) {
        // Include error details in response
        const errorMessage = err instanceof Error ? err.message : 'Invalid token';
        res.status(401).json({ message: errorMessage });
    }
};
exports.authMiddleware = authMiddleware;
