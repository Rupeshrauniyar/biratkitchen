const express = require("express")
const router = express.Router()
const {  getOrders, updateCart } = require("../../controllers/user-controllers/user-controller")
const userAuth = require("../../middlewares/auth-middleware")



// router.post("/order/create", createOrder)
router.get("/order/get", getOrders)
router.post("/cart/update",userAuth, updateCart)



module.exports = router
