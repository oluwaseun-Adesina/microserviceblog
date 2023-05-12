const http = require("http");

const dotenv = require("dotenv");
const createDbConnection = require("./src/model/config/database.js");
const app = require("./app.js");

dotenv.config();

const port = process.env.PORT || 4001;

// Connects to mongodb
createDbConnection();

http.createServer(app).listen(port);
console.log(`Started Authentication microservice server at port ${port}`);
