const orderModel = require("../../models/order-model")
const productModel = require("../../models/product-model")

const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
        if (orders.length > 0) {
            return res.status(200).json({ orders })

        } else {
            return res.status(200).json({ orders, message: "No orders found" })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}
const createProduct = async (req, res) => {
    try {
        const { name, price, image, type, category, description } = req.body
        const product = await productModel.create({ name, price, image, type, category, description })
        if (product) {
            return res.status(200).json({ product, message: "Product created successfully", status: "OK" })
        } else {
            return res.status(400).json({ message: "Product creation failed" })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });

    }
}
const updateProduct = async (req, res) => {
    try {
        const { id, name, price, image, type, category, description } = req.body
        const product = await productModel.findByIdAndUpdate(id, { name, price, image, type, category, description }, { new: true })
        if (product) {
            return res.status(200).json({ status: "OK", success: "true", product, message: "Product updated successfully" })
        } else {
            return res.status(400).json({ message: "Product update failed" })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}
const editOrderStatus = async (req, res) => {
    try {
        const Data = req.body
        const order = await orderModel.findByIdAndUpdate(Data.id, { status: Data.status }, { new: true })
        if (order) {
            return res.status(200).json({ status: "OK", success: "true", message: "Product updated successfully" })
        } else {
            return res.status(400).json({ message: "Product update failed" })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
}
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body
        const product = await productModel.findByIdAndDelete(id)
        if (product) {
            return res.status(200).json({ status: "OK", success: "true", message: "Product deleted successfully" })
        } else {
            return res.status(400).json({ status: "BAD", success: "false", message: "Product deletion failed" })
        }
    } catch (err) {
        res.status(500).json({ status: "BAD", success: "false", message: "Internal server error" });
    }
}
module.exports = { getOrders, createProduct, updateProduct, deleteProduct, editOrderStatus }
