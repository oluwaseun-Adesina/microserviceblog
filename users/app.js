const express = require("express");
const routes = require("./src/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", routes);

module.exports = app;
