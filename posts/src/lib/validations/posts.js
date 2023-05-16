const joi = require('joi')

// create post schema

const createPostSchema = joi.object({
    title: joi.string().required().messages({
        "any.required": "Please enter the title for the post",
        "string.empty": "Please enter the title for the post",
    }),
    description: joi.string().required().min(12).messages({
        "any.required": "Please enter enter the description/content of the post.",
        "string.empty": "Description must be atleast 12 characters long.",
        "string.min": "Description must be atleast 12 characters long.",
    }),

})

// update post schema
const updatePostSchema = joi.object({
    title: joi.string().messages({
        "any.required": "Please enter the title for the post",
        "string.empty": "Please enter the title for the post",
    }),
    description: joi.string().required().min(12).messages({
        "any.required": "Please enter enter the description/content of the post.",
        "string.empty": "Description must be atleast 12 characters long.",
        "string.min": "Description must be atleast 12 characters long.",
    }),
})

const validateIdSchema = joi.object({
    id: joi.string().required().min(24).messages({
      "any.required": "Please enter your id.",
      "string.empty": "Please enter your id.",
      "string.min": "Please provide a valid id."
    }),
  });
// validate create post 
const validateCreatePost = (post) => {
    return createPostSchema.validate(post)
}

// validate update post
const validateUpdatePost = (post) => {
    return updatePostSchema.validate(post)
}

const validateId = (id) => {
    return validateIdSchema.validate(id)
}

module.exports = {
    validateCreatePost,
    validateUpdatePost,
    validateId
}