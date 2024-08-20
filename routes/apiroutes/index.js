const express = require('express')
const auth = require('./auth.js')
const api = express.Router()
const allPost = require("./post.js")
const uploadImg = require("./uploadimg.js")

api.use('/auth', auth)
api.use('/posts', allPost)
api.use('/upload', uploadImg)

module.exports = api