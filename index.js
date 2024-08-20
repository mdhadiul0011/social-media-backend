require('dotenv').config()
const express = require('express')
const cors = require("cors")
const router = require('./routes')
const mongoConfig = require('./config/mongoConfig')
const fileupload = require('express-fileupload')
const app = express()

//database connect function
mongoConfig()

//important things express and middleware
app.use(express.json())
app.use(cors())
app.use(fileupload({
    useTempFiles: true
}))

//main router
app.use('/', router)

//backend port
const port = process.env.PORT || 8000

//port activation
app.listen(port, ()=> {
    console.log('Hello Developer');
})