const joi = require('joi')

// create post schema

const createPostSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),

})

// update post schema
const updatePostSchema = joi.object({
    title: joi.string(),
    description: joi.string(),
})

// validate create post 
const validateCreatePost = (post) =>{
    return createPostSchema.validate(post)
}

// validate update post
const validateUpdatePost = (post) =>{
    return updatePostSchema.valid(post)
}

module.exports = {
    validateCreatePost,
    validateUpdatePost
}