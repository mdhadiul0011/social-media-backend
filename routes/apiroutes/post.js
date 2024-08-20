const express = require('express')
const { authuser } = require('../../middleware/authuser')
const { createPost } = require('../../controller/postController/usersPost')
const router = express.Router()

router.post("/createpost", createPost)

module.exports = router