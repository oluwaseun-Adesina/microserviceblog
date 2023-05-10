const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')

const app = express()
 
app.use(cors())
app.use(express.json())

app.use('/users', proxy('http://localhost:4001'))
app.use('/', proxy('http://localhost:4002')) // This is the default route post

app.use('/', (req, res, next) =>{
    return res.status(200).json({'msg':"Hello from gateway"})
})

app.listen(4000, () =>{
    console.log(`Gateway service is running on port ${4000}`)
}) 