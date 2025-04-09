import express from 'express';
import { upload } from '../utils/uploads';
import { createPost } from '../controllers/postController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, upload.single('media'), createPost);

export default router;
