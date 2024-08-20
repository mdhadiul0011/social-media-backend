const express = require('express')
const { imgUpload } = require('../../controller/upload/imgUpload')
const { uploadmiddleware } = require('../../middleware/uploadimgmiddleware')
const router = express.Router()

router.post("/uploadimg", uploadmiddleware, imgUpload)

module.exports = router