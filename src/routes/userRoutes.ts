// backend/routes/userRoutes.ts
import express, {Response} from 'express';
import { createUser, getUserData, getUserDataByUsername, loginUser, logoutUser } from '../controllers/userController';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// POST /api/users - Create a new user

//signup
router.post('/', createUser);

//login
router.post('/login', loginUser);


// Add this route
router.get('/verify', authMiddleware, (req: AuthRequest, res: Response): void => {
  // If middleware passes, the user is authenticated
  res.status(200).json({
    success: true,
    user: req.user
  });
});

router.get('/:id', authMiddleware, getUserData)

router.post('/logout', logoutUser);

router.get('/:username', getUserDataByUsername);

export default router;