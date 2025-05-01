const productModel = require("../models/product-model")


const getProducts = async (req, res) => {
    try {
        const products = await productModel.find()
        if (products) {
            res.json({ status: "OK", products })
        } else {
            res.json({ status: "OK", products })
        }
    } catch (err) {
        res.json({ status: "BAD", msg: "Error finding products" })
    }

}


module.exports = { getProducts }

