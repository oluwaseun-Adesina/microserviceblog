const express = require('express');
const router = express.Router();
const {requireAuth, checkAdmin} = require('../../middlewares/authorize');

const { allUsers} = require('../../controllers/userController');

// get all users
router.route('/internals/users').get(requireAuth, allUsers);
 
module.exports = router;