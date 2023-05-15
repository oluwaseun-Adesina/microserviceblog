const Router = require("express").Router();

// const v1Internal = require("./v1/internal"); // Array of v1/internal routes
const v1Web = require("./v1/web"); // Array of v1/scudo routes

// On '/api/v1' use v1 routes
// Router.use("/v1/internal", ...v1Internal);
Router.use("/v1", ...v1Web);

module.exports = Router;
