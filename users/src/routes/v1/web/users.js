const express = require("express");
const router = express.Router();
const { requireAuth, checkAdmin } = require("../../../middlewares/authorize");

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  addPost,
  updatePost,
  deletePost,
} = require("../../../controllers/users");

// register user
router.route("/register").post(registerUser);

// login user
router.route("/login").post(loginUser);

// logout user
router.route("/logout").get(logoutUser);


// get user profile
router.route("/me").get(requireAuth, getUserProfile);

// get user details
router.route('/:id').get(requireAuth, getUserDetails);

// delete user
router.route('/:id').delete(requireAuth,  deleteUser);

// // forgot password
// router.route("/password/forgot").post(forgotPassword);

// // add user post
// // router.route('/users/:id/posts').post(requireAuth, createPost)

// // reset password
// router.route("/password/reset/:token").put(resetPassword);



// // add userpost
// router.route('/posts').post(requireAuth,addPost);

// // update user post
// router.route('/posts').put(requireAuth,updatePost);

// // delete user post
// router.route('/posts/:id').delete(requireAuth,deletePost);

// update password
router.route("/password/update").put(requireAuth, updatePassword);

// update profile
router.route("/me/update").put(requireAuth, updateProfile);

// get all users - admin
router.route("/admin/users").get(requireAuth, checkAdmin, allUsers);

// // get user details - admin
// router
//   .route("/admin/user/:id")
//   .get(requireAuth, checkAdmin, getUserDetails)
//   .put(requireAuth, checkAdmin, updateUser)
//   .delete(requireAuth, checkAdmin, deleteUser);

module.exports = router;
