// create database connection
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();
const dbURL = process.env.dbURL

module.exports = async() =>{
    try{
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Database connected successfully")
    }catch(error){
        console.log("Database connection failed")
        console.log(error)
        process.exit(1)
    }
}