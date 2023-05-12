const express = require("express");
const routes = require("./src/routes");
const { handleError } = require("./src/middlewares/error");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", routes);

app.use((err, req, res, next) => {
  handleError(err, res);
});

module.exports = app;
