const jwt = require('jsonwebtoken');
const User = require('../model/User')
require('dotenv').config();
const SECRETE_KEY = process.env.APP_SECRET;
// const mongoose = require('mongoose');
// const { response } = require('express');

// const secret = process.env.APP_SECRET;

const getCurrentUser = async (req, res) => {
    let token = req.headers["authorization"] || req.headers["x-access-token"];
    if (token && token.startsWith("Bearer")) token = token.slice(7);
    if (!token) {
        console.log(401, "Please login.");
    }

    try {

        const decode = jwt.verify(token, SECRETE_KEY);
        // console.log(decode)
        // const id = mongoose.Types.ObjectId(decode.currentUser._id);
        const id = decode.id.id

        // console.log(decode)
        const user = await User.findById(id)
        // const user = await User.findOne({ _id: id }); 
        // console.log(user)
        return user;

    } catch (error) {
       console.log(error)
    }

};

const requireAuth = async (req, res, next) => {


    const user = await getCurrentUser(req, res);


    if (!user) {
        return  res.json({
            status: 'error',
            message: 'Please login'

        });
    }


    req.user = user;
    next();

}

// check admin
const checkAdmin = async (req, res, next) => {

    // const token = req.cookies.jwt;
    const user = await getCurrentUser(req, res);
    try {


        if (!user) {
            return  res.json({
                status: 'error',
                message: 'Please login'
    
            });
        }

        // check if user is admin
        if(user.role === "admin"){
            req.user = user

            // req.user = {}
            next();
        }else{
            res.json("User not authorized, Please login as admin")
        }
    } catch (error) {
        console.log(error)
    }
    
    // {
    //     _id: new ObjectId("645a01f99a732d0d74971f07"),
    //     name: 'Test User',
    //     email: 'test@gmail.com',
    //     password: '$2a$10$d7uNxbZ8eqFmAIEOibciheakN82lr6xP.EL6fnYEs6TeZaqvxnet.',
    //     role: 'user',
    //     avatar: 'https://res.cloudinary.com/dj7k0lade/image/upload/v1623344783/avatars/avatar_qkxq8c.png',
    //     createdAt: 2023-05-09T08:19:05.834Z,
    //     posts: [],
    //     __v: 0
    //   }
    

    // if (token) {
    //     jwt.verify(token, secret, async (err, decodedToken) => {
    //         if (err) {
    //             console.log(err.message)
    //             res.locals.user = null;
    //             next();
    //         }
    //         else {
    //             console.log(decodedToken);
    //             let user = await User.findById(decodedToken.id);
    //             if (user.role === 'admin') {
    //                 res.locals.user = user;
    //                 next();
    //             } else {
    //                 res.json({ message: "Not Authorized, Please Login as Admin" });
    //             }
    //         }
    //     })

    // }
    // else {
    //     res.locals.user = null;
    //     next();
    // }
}

module.exports = { requireAuth, checkAdmin };