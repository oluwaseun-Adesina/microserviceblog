const joi = require("joi");

// user signup schema

const userSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "Please enter your name.",
    "string.empty": "Please enter your name.",
  }),
  email: joi.string().email().lowercase().required().messages({
    "any.required": "Please enter your email.",
    "string.empty": "Please enter your email.",
    "string.email": "Please provide a valid email.",
  }),
  password: joi.string().required().min(6).messages({
    "any.required": "Please enter your password.",
    "string.empty": "Password must be atleast 6 characters long'.",
    "string.min": "Password must be atleast 6 characters long'.",
  }),
});

// user login schema
const userLoginSchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "Please enter your email.",
    "string.empty": "Please enter your email.",
    "string.email": "Please provide a valid email."
  }),
  password: joi.string().required(),
});

// password update schema
const passwordUpdateSchema = joi.object({
  currentPassword: joi.string().required().min(5).messages({
    "any.required": "Please enter your password.",
    "string.empty": "Password must be atleast 5 characters long'.",
    "string.min": "Password must be atleast 5 characters long'.",
  }),
  newPassword: joi.string().required().min(6).messages({
    "any.required": "Please enter your new password.",
    "string.empty": "New password must be atleast 6 characters long'.",
    "string.min": "New password must be atleast 6 characters long'.",
  }),
});

// update profile schema
const updateProfileSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "Please enter your name.",
    "string.empty": "Please enter your name.",
  }),
  email: joi.string().email().lowercase().required().messages({
    "any.required": "Please enter your email.",
    "string.empty": "Please enter your email.",
    "string.email": "Please provide a valid email.",
  }),

});

// get user details schema
const getUserDetailsSchema = joi.object({
  id: joi.string().required().min(24).messages({
    "any.required": "Please enter your id.",
    "string.empty": "Please enter your id.",
    "string.min": "Please provide a valid id."
  }),
});

// validate user login
const validateUserLogin = (user) => {
  return userLoginSchema.validate(user);
};

// validate user signup
const validateUser = (user) => {
  return userSchema.validate(user);
};

// validate password update
const validatePasswordUpdate = (password) => {
  return passwordUpdateSchema.validate(password);
};

// validate profile update
const validateProfileUpdate = (profile) => {
  return updateProfileSchema.validate(profile);
};

// validate get user details
const validateGetUserDetails = (user) => {
  return getUserDetailsSchema.validate(user);
};

module.exports = {
  validateUser,
  validateUserLogin,
  validatePasswordUpdate,
  validateProfileUpdate,
  validateGetUserDetails
};
