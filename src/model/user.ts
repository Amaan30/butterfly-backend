//import React from 'react';
import mongoose, {Document, Model, Schema, Types} from 'mongoose';

export interface IUser extends Document {
        name: string;
        email: string;
        username: string;
        password: string;
        profilePicture?: string;
        bio?: string;
        followers?: Types.ObjectId[]; // ✅ Array of user IDs
        following?: Types.ObjectId[]; // ✅ Array of user IDs
}

const userSchema: Schema<IUser> = new Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        profilePicture: {type: String},
        bio: {type: String},
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Reference to other users
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Reference to other users
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
