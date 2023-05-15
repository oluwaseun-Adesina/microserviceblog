const User = require("../model/User");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { validateUser, validateUserLogin } = require("../lib/validations/users");

const lib = require("../lib/users");

const secret = process.env.APP_SECRET;
const maxAge = 30 * 60 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge,
  });
};

getResetPasswordToken = () => {
  // generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

const controller = {
  // RESGSTER USERS

  async registerUser(req, res, next) {
    try {
      let params;

      params = req.body;

      const create_user = await lib.registerUser(params);

      // console.log(create_user)

      if (create_user)
        // set header token
        req.headers.authorization = create_user;

      res.status(201).json({
        status_code: 201,
        message: "Registered Successfully",
        data: create_user,
      });
    } catch (err) {
      next(err);
    }
  },

  // LOGIN USERS

  async loginUser(req, res, next) {
    try {
      let params;

      params = req.body;

      const login_user = await lib.loginUser(params);

      if (login_user)

        // set header token
        req.headers.authorization = login_user;
      res.status(200).json({
        status_code: 200,
        message: "Logged in Successfully",
        data: login_user,
      });

    } catch (err) {
      next(err);
    }
  },

  // LOGOUT USERS

  async logoutUser(req, res, next) {
    try {

      const expiredToken = await lib.logoutUser();

      if (expiredToken) {
        req.headers.authorization = expiredToken;

        res.status(200).json({
          status_code: 200,
          message: "Logged out Successfully",
          data: expiredToken,
        });
      }

    } catch (err) {
      next(err)
    }
  },


  // GET USER PROFILE

  async getUserProfile(req, res, next) {
    try {
      // console.log(req.user)
      const user = req.user;

      res.status(200).json({
        status_code: 200,
        message: "User Profile fetched",
        data: user
      })
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },

  // CHANGE PASSWORD

  async updatePassword(req, res, next) {
    try {
      let params
      params = req.body

      const id = req.user.id

      const update_password = await lib.updatePassword(params, id)

      if (update_password) {
        res.status(200).json({
          status_code: 200,
          message: "User Password Updated Successfully",
          data: update_password
        })
      }

    } catch (err) {
      next(err)
    }
  },

  // UPDATE USER PROFILE

  async updateProfile(req, res, next) {
    try {
      let params;

      params = req.body;

      const id = req.user.id

      const update_profile = await lib.updateProfile(params, id)

      if (update_profile) {
        res.status(200).json({
          status_code: 200,
          message: "User Profile Updated Successfully",
          data: update_profile
        })
      }
    } catch (err) {
      next(err)
    }
  },

  // GET ALL USERS
  async allUsers(req, res, next) {
    try {
      const users = await User.find();

      res.status(200).json({
        status_code: 200,
        message: "Fetched All User",
        data: users
      })
    } catch (err) {
      next(err)
    }
  },

  // GET USER DETAILS

  async getUserDetails(req, res, next) {
    try {

      let params 
      
      params = req.params

      

      console.log(params)
      
      const get_user_details = await lib.getUserDetails(params)

      if(get_user_details){
        res.status(200).json({
          status_code: 200,
          message: "User Details Fetched",
          data: get_user_details
        })
      }

      res.status(200).json({ message: "User details", data: user });
    } catch (err) {
      next(err)
    }
  },



  // DELETE USER

  async deleteUser(req, res, next) {
    try {
      let params  
      params = req.params;

      console.log(params)

      const delete_user = await lib.deleteUser(params)

      if(delete_user){
        res.status(200).json({
          status_code: 200,
          message: "User Deleted Successfully",
          data: delete_user
        })
      }
      
    } catch (err) {
      next(err)
    }
  },

};

module.exports = controller;
