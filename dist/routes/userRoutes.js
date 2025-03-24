"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_js_1 = require("../controllers/userController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = express_1.default.Router();
// POST /api/users - Create a new user
//signup
router.post('/', userController_js_1.createUser);
//login
router.post('/login', userController_js_1.loginUser);
// Add this route
router.get('/verify', auth_js_1.authMiddleware, (req, res) => {
    // If middleware passes, the user is authenticated
    res.status(200).json({
        success: true,
        user: req.user
    });
});
router.post('/logout', userController_js_1.logoutUser);
exports.default = router;
