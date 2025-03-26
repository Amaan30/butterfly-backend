"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const user_js_1 = __importDefault(require("../model/user.js"));
//import jwt
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Load environment variables
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const createUser = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;
        //checking for duplicate email
        const duplicateEmail = await user_js_1.default.findOne({ email });
        if (duplicateEmail) {
            //console.error("Email already exists!!!");
            res.status(401).json({ message: 'Email already exists' });
            return;
        }
        //checking for duplicate username
        const duplicateUsername = await user_js_1.default.findOne({ username });
        if (duplicateUsername) {
            res.status(402).json({ message: 'Username already exists' });
            return;
        }
        // Create a new user instance
        const user = new user_js_1.default({ username, email, password, name });
        // Save the user to the database
        await user.save();
        //add an env for secret key here
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, jwtSecret, { expiresIn: '24h' });
        // Respond with the created user
        res.status(200).json({ success: true, message: 'User created successfully', user, token });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await user_js_1.default.findOne({ username }).select("+password");
        if (!user) {
            res.status(410).json({ message: 'Username not found' });
            return;
        }
        //console.log(user);
        if (user.password !== password) {
            res.status(411).json({ message: 'Incorrect password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, jwtSecret, { expiresIn: '24h' });
        console.log("✅ Generated Token:", token);
        console.log("✅ Setting Cookie for:", user.username);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 //24hrs in milliseconds
        }).status(200).json({
            success: true,
            message: 'User login successfully',
            user,
            token
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.loginUser = loginUser;
const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    }).status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
};
exports.logoutUser = logoutUser;
const getUserData = async (req, res) => {
    try {
        const user = await user_js_1.default.findById(req.params.id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserData = getUserData;
