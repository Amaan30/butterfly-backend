//import React from 'react';
import mongoose, {Document, Schema} from 'mongoose';

interface IUser extends Document {
        name: string;
        email: string;
        username: string;
        password: string;
}

const userSchema: Schema = new Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true}
});

const user = mongoose.model<IUser>('User', userSchema);

export default user;
