// backend/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../model/user.js';

//import jwt
import jwt from 'jsonwebtoken';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, name } = req.body;

    //checking for duplicate email
    const duplicateEmail = await User.findOne({email});
    if(duplicateEmail){
      //console.error("Email already exists!!!");
      res.status(401).json({ message: 'Email already exists' });
      return;
    }

    //checking for duplicate username
    const duplicateUsername = await User.findOne({username});

    if(duplicateUsername){
      res.status(402).json({ message: 'Username already exists'});
      return;
    }

    // Create a new user instance
    const user = new User({ username, email, password, name });

    // Save the user to the database
    await user.save();

    //add an env for secret key here
    const token = jwt.sign(
      {id: user._id, username: username}, jwtSecret,
      { expiresIn: '24h'}
    );

    // Respond with the created user
    res.status(200).json({ message: 'User created successfully', user, token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({username}).select("-password");
    if(!user){
      res.status(410).json({message: 'Username not found'});
      return;
    }
    //console.log(user);
    if(user.password !== password){
      res.status(411).json({message: 'Incorrect password'});
      return;
    }

    const token = jwt.sign(
      {id: user._id, username: username, name: user.name, email: user.email}, jwtSecret,
      { expiresIn: '24h'}
    );

    console.log("✅ Generated Token:", token);
    console.log("✅ Setting Cookie for:", user.username);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 24*60*60*1000 //24hrs in milliseconds
    }).status(200).json({ 
      success: true, 
      message: 'User login successfully', 
      user, 
      token 
    });
  }catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  }).status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

export const getUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};