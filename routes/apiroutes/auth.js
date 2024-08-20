const express = require('express')
const { regController, verifiedcontroller, logincontroller, reVerification, findUser, resetCode, verifyCode, changepassword } = require('../../controller/AuthController/userauthenticate')
const { authuser } = require('../../middleware/authuser')
const router = express.Router()

router.post('/', regController)
router.post('/activate', authuser, verifiedcontroller)
router.post('/login', logincontroller)
router.post('/reverification', authuser, reVerification)
router.post('/resetpass', findUser)
router.post('/resetcode', resetCode)
router.post('/verifycode', verifyCode)
router.post('/changepass', changepassword)

module.exports = router
