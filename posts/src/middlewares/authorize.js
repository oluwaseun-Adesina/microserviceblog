const jwt = require('jsonwebtoken');
// const User = require('../model/User')
require('dotenv').config();
const SECRETE_KEY = process.env.APP_SECRET;
// const mongoose = require('mongoose');
// const { response } = require('express');

const secret = process.env.APP_SECRET;

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
        // const id = decode.id
        // const user = await User.findOne({ _id: id });
        // console.log(user)
         
        // decode

        // console.log(decode.id)
        // console.log(decode)
        return decode;


    } catch (error) {
       console.log(error)
    }

};

const requireAuth = async (req, res, next) => {


    const currentUser = await getCurrentUser(req, res);

    user = currentUser.id




    if (!user) {
        return  res.json({
            status: 'error',
            message: 'Please login'

        });
    }

    // console.log(user)
    req.user = user;
    next();

}


module.exports = { requireAuth };