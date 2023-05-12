const express = require('express')
const Post = require('../model/Post')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const { validateCreatePost, validateUpdatePost} = require('../lib/validations/postValidator')

const getUserRoute = process.env.getUserRoute

// get all the post
exports.getAllPosts = async (req, res, next) => {

    try {
        const posts = await Post.find()
        res.json({ message: "All post", data: posts })
        next()
    } catch (error) {
        next(error)
    }
}

exports.getSinglePost = async (req, res, next) => {
    try {
        const id = req.params.id


        const post = await Post.findById({id})

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        res.json(post)
    } catch (error) {
        next(error)
    }
}

exports.createPost = async (req, res, next) => {
    
    try {

        const { error } = validateCreatePost(req.body)

        if(error){
            return res.status(400).json({ message: error.details[0].message})
        }

        const { title, description } = req.body
        // get current user
        const createdbyUser = req.user

        const createdbyUserId = createdbyUser.id

        // create post
        const post = await Post.create({
            title: title,
            description: description,
            createdby: createdbyUserId,
            createdAt: new Date()
        })

        // return response
        res.status(201).json({ message: "Post created successfully", date: post })

    } catch (error) {

        next(error)
    }
}


exports.updatePost = async (req, res, next) => {
    try {

        const { error } = validateUpdatePost(req.body)

        if(error){
            return res.status(400).json({ message: error.details[0].message})
        }
        // get current user
        const id = req.params.id

        const post = await Post.findById(id)

        // console.log(post)

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        post.title = req.body.title || post.title
        post.description = req.body.description || post.description

        await post.save()


        res.json({ message: "post updated successfull", data: post })
    } catch (error) {

        next(error)
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const id = req.params.id
        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({ message: "Post not Found" })
        }

        // Check that the user is authorized to delete the post
        if (post.createdby !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Post.findByIdAndDelete(id)
        // Delete the post
        // await post.remove();



        res.json({ message: "Post Deleted Successfully", data: post })
    } catch (error) {
        next(error)
    }
}


// get post by user
exports.getPostByUser = async (req, res, next) => {
    try {

        // get user
        user = req.user

        userId = user.id

        // Find posts created by the user
        const posts = await Post.find({ createdby: userId });

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        // find post when createby.id equal user id


        // const post = await Post.find({_id: userId})

        // return res.json(posts)

        if (!posts) {
            return res.status(404).json({ message: "Post not found" })
        }

        res.json({ message: "Post by single user", data: posts })
    } catch (error) {
        next(error)
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
        const posts = await Post.find();
        const users = await axios.get('http://localhost:4000/users/internals/users', {
            headers: {
                Authorization: req.headers.authorization
            }
        })

        // JSON.stringify(users.data)
        return res.send(users.data)
        const postsWithUser = posts.map(post => {
            const user = users.data.find(user => user.id === post.createdby)

            // console.log(user)
            // console.log(`user ${user} and post ${post}`)
            return {
                post: {
                    _id: post._id,
                    title: post.title,
                    description: post.description,
                    createdAt: post.createdAt
                },
                author: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                }
            }
        })

        res.json({ message: "Post by single user", data: postsWithUser })

    } catch (error) {
        next(error)
    }
}
       // get the user
        // const post = await Post.aggregate([
        //     {
        //         $group: {
        //             _id: "$createdby",
        //             count: { $sum: 1 }
        //         }
        //     }
        // ])

        // res.json({ message: "Post Grouped by User", data: post })

// count all post aggregation 
exports.countAllPost = async( req, res, next) =>{
    try{
        const Count = await Post.aggregate([
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])


        res.json({message: "Count All post",data: Count} )

    }catch(error){
        next(error)
    }
}