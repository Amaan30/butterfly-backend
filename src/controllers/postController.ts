import express from 'express';
import { Post } from '../model/post';
import User from '../model/user';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';


export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!req.user?._id) {
      res.status(401).json({ message: 'Unauthorized: No user found in request' });
      return;
    }

    const newPost = new Post({
      title,
      content,
      media: req.file?.path, // Cloudinary secure URL
      mediaType: req.file?.mimetype.startsWith('video') ? 'video' : 'image',
      author: req.user._id,
    });

    const saved = await newPost.save();
    res.status(201).json(saved);
    return;
  } catch (err) {
    console.error('Post creation error:', err);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};
