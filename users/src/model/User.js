const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be atleast 6 characters long'],
        select: false
    },
    role: {
        type: String,
        default: 'user',
        enum: {
            values: ['user', 'admin'],
            message: 'Please select correct role'
        }
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dj7k0lade/image/upload/v1623344783/avatars/avatar_qkxq8c.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // posts: [{
    //     _id: { type: String, require: true },
    //     title: { type: String, require: true },
    //     description: { type: String, require: true },
    //     createdAt: { type: Date, default: Date.now },
    //     createdby: {type: String, require: true}
    // }],
})

// 
// userSchema.pre('save', async function (next) {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt)
//     next();
// })

module.exports = mongoose.model('User', userSchema);