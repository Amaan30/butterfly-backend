// backend/routes/userRoutes.ts
import express, {Response} from 'express';
import { createUser, getUserData, loginUser, logoutUser } from '../controllers/userController.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// POST /api/users - Create a new user

//signup
router.post('/', createUser);

//login
router.post('/login', loginUser);


// Add this route
router.get('/verify', authMiddleware, (req: AuthRequest, res: Response) => {
  // If middleware passes, the user is authenticated
  res.status(200).json({
    success: true,
    user: req.user
  });
});

router.get('/:id', authMiddleware, getUserData)

router.post('/logout', logoutUser);

export default router;