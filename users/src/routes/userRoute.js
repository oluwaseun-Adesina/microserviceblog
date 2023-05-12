const express = require('express');
const router = express.Router();
const {requireAuth, checkAdmin} = require('../middlewares/authorize');

const {registerUser, loginUser, logoutUser, getUserProfile, updatePassword, updateProfile, getUserDetails, deleteUser} = require('../controllers/userController');

// register user
router.route('/register').post(registerUser);

// login user
router.route('/login').post(loginUser); 

// logout user
router.route('/logout').get(logoutUser);

// get user profile
router.route('/me').get(requireAuth, getUserProfile);

// get user details
router.route('/:id').get(requireAuth, getUserDetails);

// delete user
router.route('/:id').delete(requireAuth, checkAdmin, deleteUser);


// update password
router.route('/password/update').put(requireAuth, updatePassword);

// update profile
router.route('/me/update').put(requireAuth, updateProfile);

module.exports = router;