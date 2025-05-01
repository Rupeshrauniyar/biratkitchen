const adminModel = require("../models/admin-model")
const jwt = require("jsonwebtoken")
const adminAuth = async (req, res, next) => {
    try {

        const token = req?.headers?.authorization.split(' ')[1]
        if (!token && !token?.length > 1 || token === undefined || token === null) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.ADMIN_SECRET)
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const admin = await adminModel.findById(decoded.adminId)
        req.admin = admin
        next()
    } catch (err) {
        if (err.message === "jwt expired") {
            return res.status(401).json({ message: "Unauthorized" })
        }
        if (err.message === "invalid token") {
            return res.status(401).json({ message: "Unauthorized" })
        }
        if (err.message === "jwt malformed") {
            return res.status(401).json({ message: "Unauthorized" })
        }
        res.status(500).json({ message: "Internal server error" })
    }

}

module.exports = adminAuth