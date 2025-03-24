//middleware/auth.ts
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if(!jwtSecret){
        throw new Error('JWT_SECRET is not defined in environment variables');
}

interface User {
        _id: string;
        username: string;
        name: string;
        email: string;
        role?: string;
}

// Define interface to extend Express Request
export interface AuthRequest extends Request {
        cookies: {
                token?: string;
        };
        user?: User;     // You can replace 'any' with a more specific user type
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {

        // Extract token from cookies
        
        const token = req.cookies.token;

        // if no token exists return unauthorized
        if(!token) {
                res.status(401).json({ message: 'no token provided' });
                return;
        } 

        try{
                //verify token validity

                const decoded = jwt.verify(token, jwtSecret);


                // Check if the decoded token matches the User interface
                if (typeof decoded === 'object' && decoded !== null &&
                        'username' in decoded && 'name' in decoded && 'email' in decoded) {
                        // Attach user data to request
                        req.user = {
                                _id: decoded.id,
                                username: decoded.username,
                                name: decoded.name,
                                email: decoded.email
                        }
                } else {
                        throw new Error('Invalid token structure');
                }

                // Continue to the next middleware or route handler
                next();
        } catch(err){
                // Include error details in response
                const errorMessage = err instanceof Error ? err.message : 'Invalid token';
                res.status(401).json({ message: errorMessage });
        }
}