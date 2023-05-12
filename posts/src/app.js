const express = require("express");
const dotenv = require("dotenv");
const database = require('../src/model/config/database');
dotenv.config();
const PORT = process.env.PORT;
const router = require("./routes/postRoute");

const StartServer = async () => {
  const app = express();

  await database();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(router);

  app.listen(PORT, () => {
    console.log(`Posts service is running on port ${PORT}`);
  });
};
StartServer();
