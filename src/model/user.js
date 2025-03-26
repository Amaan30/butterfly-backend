"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import React from 'react';
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }], // ✅ Reference to other users
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }], // ✅ Reference to other users
});
var User = mongoose_1.default.model('User', userSchema);
exports.default = User;
