const orderModel = require("../../models/order-model")
const userModel = require("../../models/user-model")
const jwt = require("jsonwebtoken")
require("dotenv").config


const getOrders = async (req, res) => {
    try {
        const Data = req.query

        if (Data?.id) {
            const orders = await orderModel.findOne({ _id: Data.id }).populate({
                path: "foodDetails.product"
            })
            if (orders._id) {
                return res.status(200).json({ orders })

            } else {
                return res.status(200).json({ orders, message: "No orders found" })
            }
        } else {
            const token = req?.headers?.authorization.split(" ")[1]
            if (!token && !token?.length > 1 || token === undefined || token === null) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            const decoded = jwt.verify(token, process.env.USER_SECRET)
            const orders = await orderModel.find({ user: decoded.userId })
            if (orders.length > 0) {
                return res.status(200).json({ orders })

            } else {
                return res.status(200).json({ orders, message: "No orders found" })
            }
        }


    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateCart = async (req, res) => {
    try {
        const user = req.user
        const Data = req.body
        if (Data) {
            const updatedCart = await userModel.findOneAndUpdate({ _id: user._id }, {
                cart: Data
            }, { new: true })
            if (updatedCart) {
                res.json({ success: true })
            } else {
                res.json({ success: false })

            }
        } else {
            res.json({ success: false })
        }
    } catch (err) {
        res.json({ success: false })
    }
}

module.exports = { getOrders, updateCart }