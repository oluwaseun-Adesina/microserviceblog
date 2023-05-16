const bcrypt = require("bcryptjs");

const Post = require("../model/Post");
const { AppError } = require("../middlewares/error");

const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const { validateCreatePost, validateUpdatePost, validateId } = require('../lib/validations/posts')

const getUserRoute = process.env.getUserRoute


const lib = {
    async getAllPosts(params) {
        const posts = await Post.find()


        return posts;
    },

    async getSinglePost(params) {
        const post = await Post.findById(params.id)

        if (!post) {
            throw new AppError(404, "Post not found");
        }

        return post;
    },

    async createPost(params, user) {
        let { error } = validateCreatePost(params)

        if (error) {
            throw new AppError(400, error.details[0].message)
        }

        const { title, description } = params
        // get current user
        const createdbyUser = user

        const createdbyUserId = createdbyUser.id

        const post = await Post.create({
            title,
            description,
            createdby: createdbyUserId,
            createdAt: Date.now()
        })

        return post
    },

    async updatePost(params, user, idObject) {

        let { error: idError } = validateId(idObject)

        if (idError) {
            throw new AppError(400, idError.details[0].message)
        }

        // error = null

        let  { error: paramsError } = validateUpdatePost(params)

        // error1  = validateUpdatePost(params)
         
        if (paramsError) {
            throw new AppError(400, paramsError.details[0].message)
        }

        const { title, description } = params

        const updatedbyUser = user

        const updatedbyUserId = updatedbyUser.id
        
        const post = await Post.findByIdAndUpdate(idObject.id, {
            title,
            description,
            updatedby: updatedbyUserId,
            updatedAt: Date.now()
        }, { new: true })

        if (!post) {
            throw new AppError(404, "Post not found");
        }

        return post
    },

    async deletePost(params) {

        const { error } = validateId(params)

        if (error) {
            throw new AppError(400, error.details[0].message)
        }

        const post = await Post.findByIdAndDelete(params.id)

        if (!post) {
            throw new AppError(404, "Post not found");
        }

        return post
    },

    async getPostByUser(params) {

        const { error } = validateId(params)

        if (error) {
            throw new AppError(400, error.details[0].message)
        }

        const posts = await Post.find({ createdby: params.id })

        if (!posts) {
            throw new AppError(404, "User have no post");
        }

        return posts
    },

    async countPostByUser( params){

        const { error } = validateId(params)

        if (error) {
            throw new AppError(400, error.details[0].message)
        }
        const count = await Post.countDocuments({ createdby: params.id })

        if(!count){
            throw new AppError(404, "User have no post");
        }

        

        return count
    },

    async countAllPost(){
        const count = await Post.countDocuments()

        if(!count){
            throw new AppError(404, "No post found");
        }

        return count
    }
    
};

module.exports = lib;
