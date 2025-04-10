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
    const {username} = req.params;
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

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    const { page = 1, limit = 5 } = req.query;

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const posts = await Post.find({ author: { $in: user.following } })
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('author', 'username profilePicture');

    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching feed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: No user found in request' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (!post.likes) {
      post.likes = []; // Initialize likes array if it doesn't exist
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((like) => like.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ success: true, likesCount: post.likes.length });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}