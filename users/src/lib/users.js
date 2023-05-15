const bcrypt = require("bcryptjs");

const User = require("../model/User");
const {AppError} = require("../middlewares/error");

// const {createToken} = require("../lib/createToken");

const { validateUser, validateUserLogin, validatePasswordUpdate, validateProfileUpdate, validateGetUserDetails } = require("../lib/validations/users")

const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const secret = process.env.APP_SECRET;
const maxAge = 30 * 60 * 60 * 60;
const  createToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge,
  });
};

const lib = {
  async registerUser(params) {
    // validate user input
    const { error } = validateUser(params);

    if (error) {
      throw new AppError(400, error.details[0].message);
    }

    const { name, email, password, role } = params;

    const emailExist = await User.findOne({email: email})


    if (emailExist) {
      throw new AppError(400, "Email already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = createToken({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    return token;
  },

  async loginUser(params) {

    // validate user input
    const { error } = validateUserLogin(params);

    if(error){
      throw new AppError(400, error.details[0].message)
    }

    const { email, password } = params;

    // check if email exists
    const emailExist = await User.findOne({email: email}).select("password");

    if(!emailExist){
      throw new AppError(400, "Email does not exist")
    }

    // check if password is correct
    const validPassword = bcrypt.compareSync(password, emailExist.password);  

    if(!validPassword){
      throw new AppError(400, "Invalid password")
    }

    const token = createToken({
      id: emailExist._id,
      name: emailExist.name,
      email: emailExist.email,
    });


    return token;
  },

  async logoutUser(){

    const expiredToken = jwt.sign({ id: null }, secret, {
      expiresIn: 1,
    });

    return expiredToken

  },

  async updatePassword(params, id){
    const { error } = validatePasswordUpdate(params)

    if(error){
      throw new AppError(400, error.details[0].message)
    }

    const user = await User.findById(id).select("+password")

    const { currentPassword, newPassword} = params

    // check if current password is correct
    const isMatch = await bcrypt.compareSync( currentPassword, user.password);

    if(!isMatch){
      throw new AppError(400, "Invalid Current password");
    }

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword;

    await user.save()

    return user

  },

 async updateProfile(params, id){
  const { error } = validateProfileUpdate(params)

  if(error){
    throw new AppError(400, error.details[0].message)
  }

  const { name, email} = params

  const user = await User.findById(id)

  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();

  return user

 },

 async getUserDetails(params){
  const { error } = validateGetUserDetails(params)

  if(error){
    throw new AppError(400, error.details[0].message)
  }

  const user = await User.findById(params.id)

  if(!user){
    throw new AppError(400, "User not found")
  }

  return user
 },

 async deleteUser( params ){

  const { error } = validateGetUserDetails(params)

  if(error){
    throw new AppError(400, error.details[0].message)
  }

  let id = params.id
  const user = await User.findById(id)

  if(!user){
    throw new AppError(400, "User not found")
  }

  User.findByIdAndDelete(id);
  
  return user

 }


};

module.exports = lib;
