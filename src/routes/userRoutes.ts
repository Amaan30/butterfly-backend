// backend/routes/userRoutes.ts
import express, {Response} from 'express';
import { addFollower, createUser, getFollowingInfo, getUserDataByUsername, loginUser, logoutUser, removeFollower, updateInfo, updateProfilePicture } from '../controllers/userController';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();

// Multer setup for file upload
import path from 'path';
import fs from 'fs';

// Create uploads directory with absolute path
const uploadsDir = path.resolve(process.cwd(), 'uploads/profilePics');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created directory: ${uploadsDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Using uploads directory: ${uploadsDir}`);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Update the route to use authentication middleware
router.post('/upload-pfp', authMiddleware, upload.single('profilePicture'), updateProfilePicture);

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

router.put('/edit-profile', authMiddleware, updateInfo);

router.post('/follow/:username', authMiddleware, addFollower);

router.delete('/unfollow/:username', authMiddleware, removeFollower);

router.get('/getfollowing/:username', authMiddleware, getFollowingInfo);

export default router;