const express = require('express');
const router = express.Router();
const {requireAuth, checkAdmin} = require('../middlewares/authorize');

const {getAllPosts, getSinglePost, createPost, updatePost, deletePost, getPostByUser, countPostByUser, countAllPost} = require('../controllers/postController')

// veiw all post
router.route('/posts').get(getAllPosts);

// get post by signed in getPostByUser
router.route('/posts/user').get(requireAuth, getPostByUser)

// count post by user 
router.route('/posts/count').get(requireAuth, countAllPost)

// count post by user 
router.route('/posts/count/user').get(requireAuth, countPostByUser)

// get single post
router.route('/posts/:id').get(requireAuth,getSinglePost);



// create post
router.route('/posts').post( requireAuth, createPost);

// edit post
router.route('/posts/:id').put(requireAuth, updatePost)

// delete post
router.route('/posts/:id').delete(requireAuth, deletePost)

// 


module.exports = router; 
