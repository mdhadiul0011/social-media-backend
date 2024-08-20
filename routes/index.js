const express = require("express")
const api = require("./apiroutes")
const router = express.Router()

const baseapi = process.env.API_URL

router.use(baseapi, api)

module.exports = router