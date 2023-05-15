const express = require('express')
const Post = require('../model/Post')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const { validateCreatePost, validateUpdatePost } = require('../lib/validations/posts')

const getUserRoute = process.env.getUserRoute

const lib = require("../lib/posts");

// get all the post
exports.getAllPosts = async (req, res, next) => {

    try {

        get_all_posts = await lib.getAllPosts()

        res.status(201).json({
            status_code: 201,
            message: "All Posts Fetched",
            data: get_all_posts,
        });

    } catch (err) {
        next(err)
    }
}

exports.getSinglePost = async (req, res, next) => {
    try {

        const params = req.params

        const get_single_post = await lib.getSinglePost(params)

        res.status(201).json({
            status_code: 201,
            message: "Single Post Fetched",
            data: get_single_post,
        });
    } catch (err) {
        next(err)
    }
}

exports.createPost = async (req, res, next) => {

    try {

        let params = req.body

        const user = req.user

        const create_post = await lib.createPost(params, user)
        
        res.status(201).json({
            status_code: 201,
            message: "Post Created Successfully",
            data: create_post,
        });

    } catch (err) {

        next(err)
    }
}


exports.updatePost = async (req, res, next) => {
    try {
        let params = req.body
        let user = req.user

        const update_post = await lib.updatePost(params, user)

        res.status(201).json({
            status_code: 201,
            message: "Post Updated Successfully",
            data: update_post,
        });

    } catch (err) {
        next(err)
    }
}

exports.deletePost = async (req, res, next) => {
    try {

        const params = req.params

        const delete_post = await lib.deletePost(params)

        res.status(201).json({
            status_code: 201,
            message: "Post Deleted Successfully",
            data: delete_post,
        });

    } catch (err) {
        next(err)
    }
}


// get post by user
exports.getPostByUser = async (req, res, next) => {
    try {
        let params = req.params     
        
        const posts_by_user = await lib.getPostByUser(params)

        res.status(201).json({
            status_code: 201,
            message: "Post by single user",
            data: posts_by_user,
        });

    } catch (err) {
        next(err)
    }
}

// // count all post by user aggregation 
// exports.countPostByUser = async (req, res, next) => {
//     try {

//         const posts = await Post.find();

//         const users = await axios.get('http://localhost:4000/users/internals/users', {
//             headers: {
//                 Authorization: req.headers.authorization
//                 }
//                 })

//         const postsWithUser = posts.map(post => {
//             const user = users.data.find(user => user.id === post.createdby)
//             return {
//                 ...post.toObject(),
//                 user

//             }

//         })

//         const post = postsWithUser

//         res.json({ message: "Post by single user", data: postsWithUser })

//     } catch (error) {
//         next(error)
//     }

// }

exports.countPostByUser = async (req, res, next) => {
    try {
        let params = req.params
        const count_post_by_user = await lib.countPostByUser(params)


        res.status(201).json({
            status_code: 201,
            message: "all post count by user",
            data: count_post_by_user,
        });


    } catch (error) {
        next(error)
    }
}

// count all post aggregation 
exports.countAllPost = async (req, res, next) => {
    try {

        const count_all_post = await lib.countAllPost()
        const Count = await Post.aggregate([
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])

        res.status(201).json({
            status_code: 201,
            message: "all post count",
            data: count_all_post,
        });

      

    } catch (error) {
        next(error)
    }
}