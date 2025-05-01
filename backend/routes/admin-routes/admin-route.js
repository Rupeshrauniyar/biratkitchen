const express = require("express")
const router = express.Router()
const { getOrders, createProduct, updateProduct, deleteProduct, editOrderStatus } = require("../../controllers/admin-controller/admin-controller")
const adminAuth = require("../../middlewares/adminAuth-middleware")

router.get("/order", adminAuth, getOrders)
router.post("/order/edit-status", adminAuth, editOrderStatus)
router.post("/product/create", adminAuth, createProduct)
router.put("/product/update", adminAuth, updateProduct)
router.post("/product/delete", adminAuth, deleteProduct)

module.exports = router
