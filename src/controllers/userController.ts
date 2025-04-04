// backend/controllers/userController.ts
import e, { Request, Response } from 'express';
import User, {IUser} from '../model/user.js';

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
      {_id: user._id}, jwtSecret,
      { expiresIn: '24h'}
    );

    // Respond with the created user
    res.status(200).json({ success: true, message: 'User created successfully', user, token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({username}).select("+password");
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
      {_id: user._id}, jwtSecret,
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

// export const getUserData = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getUserDataByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({username}).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    console.log("Upload request received", req.file);
    if (!req.file) {
      console.log("No file in request");
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const filePath = `/uploads/profilePics/${req.file.filename}`;
    console.log("File path:", filePath);
    
    // Assuming you're getting user ID from auth middleware
    const userId = (req as any).user?._id;
    console.log("User ID:", userId);
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { profilePicture: filePath },
      { new: true }
    );
    
    console.log("Updated user:", updatedUser);
    res.status(200).json({ success: true, profilePicture: filePath });
  } catch (error) {
    console.error('Detailed error uploading profile picture:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const updateInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, bio, name } = req.body;
    const userId = (req as any).user?._id;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { username, bio, name },
      { new: true, runValidators: true } // Ensure that the updated user is returned and validators are run
    );
    
    console.log("Updated user:", updatedUser);
    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const addFollower = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const userId = (req as any).user?._id;
    const TargetId =  await User.findOne({username}).select("_id");
    if(!TargetId){
      res.status(404).json({ message: "User not found" });
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: TargetId }
    });

    await User.findByIdAndUpdate(TargetId, {
      $addToSet: { followers: userId }
    });
    

  } catch(error) {
    console.error('Error adding follower:', error);
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const removeFollower = async (req: Request, res: Response): Promise<void> => {};

export const getFollowers = async (req: Request, res: Response): Promise<void> => {};