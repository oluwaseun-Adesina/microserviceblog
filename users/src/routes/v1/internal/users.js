const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../../middlewares/authorize");

const { allUsers } = require("../../../controllers/users");

// get all users
router.route("/users").get(requireAuth, allUsers);

module.exports = router;
