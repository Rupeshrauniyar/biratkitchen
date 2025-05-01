const { getProducts } = require("../controllers/normal-controller")
const express = require("express")
const router = express.Router()

router.get("/products/get", getProducts)

module.exports = router