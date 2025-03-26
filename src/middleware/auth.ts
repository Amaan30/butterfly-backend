//middleware/auth.ts
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';
import User, {IUser} from '../model/user';
import { HydratedDocument } from 'mongoose';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if(!jwtSecret){
        throw new Error('JWT_SECRET is not defined in environment variables');
}

// Define interface to extend Express Request
export interface AuthRequest extends Request {
        cookies: {
                token?: string;
        };
        user?: HydratedDocument<IUser>;     // You can replace 'any' with a more specific user type
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {

        // Extract token from cookies
        
        const token = req.cookies.token;

        // if no token exists return unauthorized
        if(!token) {
                res.status(401).json({ message: 'no token provided' });
                return;
        } 

        try{
                //verify token validity

                const decoded = jwt.verify(token, jwtSecret) as {_id: "string"};


                // Check if the decoded token matches the User interface
                const user = await User.findById(decoded._id).select("-password");

                if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
                }

                req.user = user; // ✅ Attach full Mongoose user document to request

                next();
        } catch(err){
                // Include error details in response
                const errorMessage = err instanceof Error ? err.message : 'Invalid token';
                res.status(401).json({ message: errorMessage });
        }
}