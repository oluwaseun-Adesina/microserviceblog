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

      if (create_user.token)
        res.status(201).json({
          status_code: 201,
          message: "Registered Successfully",
          data: create_user.token,
        });
    } catch (err) {
      next(err);
    }
  },

  // LOGIN USERS

  async loginUser(req, res, next) {
    try {
      // validate user input
      const { error } = validateUserLogin(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { email, password } = req.body;

      // check if email already exists
      const emailExist = await User.findOne({ email }).select("password");

      // console.log(emailExist)

      if (!emailExist) {
        return res.status(400).json({ message: "Email does not exist" });
      }

      // check if password is correct
      const validPassword = bcrypt.compareSync(password, emailExist.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = createToken({
        id: emailExist._id,
        name: emailExist.name,
        email: emailExist.email,
      });
      // console.log(token)

      // console.log(emailExist)

      // set header token
      req.headers.authorization = token;

      res.status(200).json({
        message: "Logged in successfully",
        data: emailExist,
        auth: token,
      });

      // console.log(req.headers)
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  },

  // LOGOUT USERS

  async logoutUser(req, res, next) {
    try {
      // make the token  in the header expire
      const expiredToken = jwt.sign({ id: null }, secret, {
        expiresIn: 1,
      });
      req.headers.authorization = expiredToken;

      // res.cookie('jwt', '', { maxAge: 1})

      // req.headers.authorization = null

      // console.log(req.headers)

      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  },

  // FORGOT PASSWORD

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      // check if email already exists
      const emailExist = await UserfindOne({ email });

      if (!emailExist) {
        return res.status(400).json({ message: "Email does not exist" });
      }

      // get reset token
      const resetToken = emailExist.getResetPasswordToken();

      await emailExist.save();

      // create reset url

      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/resetpassword/${resetToken}`;

      // const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

      // try{

      //     await sendEmail({
      //         email: emailExist.email,
      //         subject: 'Password reset token',
      //         message
      //     })

      //     res.status(200).json({ success: true, data: 'Email sent' })

      // }
      // catch(err){
      //     console.log(err)
      //     emailExist.resetPasswordToken = undefined
      //     emailExist.resetPasswordExpire = undefined

      //     await emailExist.save()

      //     return next(new ErrorResponse('Email could not be sent', 500))
      // }
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  },

  // RESET PASSWORD

  async resetPassword(req, res, next) {
    console.log(req.params.resetToken);
  },

  // GET USER PROFILE

  async getUserProfile(req, res, next) {
    try {
      // console.log(req.user)
      const user = req.user;

      res
        .status(200)
        .json({ message: "User profile fetched successfully", data: user });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },

  // CHANGE PASSWORD

  async updatePassword(req, res, next) {
    try {
      // get user
      const user = await User.findById(req.user.id).select("+password");

      // check if current password is correct
      const isMatch = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

      user.password = hashedPassword;

      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },

  // UPDATE USER PROFILE

  async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;

      // get user
      const user = await User.findById(req.user.id);

      user.name = name || user.name;
      user.email = email || user.email;

      await user.save();

      res
        .status(200)
        .json({ message: "Profile updated successfully", data: user });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },

  // GET ALL USERS
  async allUsers(req, res, next) {
    try {
      const users = await User.find();

      res.status(200).json({ message: "Fetched All User", data: users });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },

  // GET USER DETAILS

  async getUserDetails(req, res, next) {
    try {
      const { id } = req.params;

      // find user
      const user = await User.findById(id);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User details", data: user });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },

  // UPDATE USER

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;

      // find user
      const user = await User.findById(id);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const { name, email, role } = req.body;

      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;

      await user.save();

      res
        .status(200)
        .json({ message: "User updated successfully", data: user });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },

  // DELETE USER

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // find user
      const user = await User.findById(id);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // remove user

      User.findByIdAndDelete(id);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  },

  async createPost(req, res, next) {
    try {
      const user = User.findById({ _id: req.user._id });

      if (!user) {
        return res.status(404).json({ message: "User not Found" });
      }

      const newPost = {};

      user.posts.push(newPost);

      await user.save();

      res.status(201).json({ message: "Post Created", post: newPost });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = controller;
