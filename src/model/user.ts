//import React from 'react';
import mongoose, {Document, Model, Schema, Types} from 'mongoose';

export interface IUser extends Document {
        _id: Types.ObjectId; // ✅ ObjectId type for MongoDB
        name: string;
        email: string;
        username: string;
        password: string;
        profilePicture?: string;
        bio?: string;
        followers?: Types.ObjectId[]; // ✅ Array of user IDs
        following?: Types.ObjectId[]; // ✅ Array of user IDs
        posts?: Types.ObjectId[]; // ✅ Array of post IDs
}

const userSchema: Schema<IUser> = new Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        profilePicture: {type: String, default: "/images/Default-pfp.jpg"},
        bio: {type: String, default: "Available"},
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Reference to other users
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Reference to other users
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Reference to posts
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
