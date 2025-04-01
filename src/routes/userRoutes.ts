// backend/routes/userRoutes.ts
import express, {Response} from 'express';
import { createUser, getUserDataByUsername, loginUser, logoutUser, updateProfilePicture } from '../controllers/userController';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in an "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Profile picture upload route
router.post('/upload-pfp', upload.single('profilePicture'), updateProfilePicture);

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

//router.get('/:id', authMiddleware, getUserData)

router.post('/logout', logoutUser);

router.get('/:username', getUserDataByUsername);

export default router;