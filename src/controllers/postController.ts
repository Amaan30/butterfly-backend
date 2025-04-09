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
    if (saved) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { posts: saved._id } },
        { new: true }
      );
      return;
    }
    res.status(201).json(saved);
    return;
  } catch (err) {
    console.error('Post creation error:', err);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const username = req.params;
    const user = await User.findOne({ username }).populate('posts');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user.posts);
  } catch (err) {
    console.error('Error fetching user posts:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};