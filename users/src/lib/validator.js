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

// validate user login
const validateUserLogin = (user) => {
  return userLoginSchema.validate(user);
};

// validate user signup
const validateUser = (user) => {
  return userSchema.validate(user);
};

module.exports = {
  validateUser,
  validateUserLogin,
};
