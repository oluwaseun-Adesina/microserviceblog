const joi = require('joi');

// user signup schema

const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
});

// user login schema
const userLoginSchema = joi.object({
    email: joi.string().email().required(),
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