import express from 'express';
import { upload } from '../utils/uploads';
import { createPost, getFeed, getUserPosts } from '../controllers/postController';
import { authMiddleware } from '../middleware/auth';
import { get } from 'node:http';

const router = express.Router();

router.post('/', authMiddleware, upload.single('media'), createPost);

router.get('/feed', authMiddleware, getFeed);

router.get('/:username', authMiddleware, getUserPosts);

export default router;
