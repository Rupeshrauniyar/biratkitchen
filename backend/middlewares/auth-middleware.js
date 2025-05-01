const userModel = require("../models/user-model")
const jwt = require("jsonwebtoken")
const userAuth = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization.split(' ')[1]

        if (!token && !token?.length > 1 || token === undefined || token === null) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.USER_SECRET)
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const user = await userModel.findById(decoded.userId)
        req.user = user
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

module.exports = userAuth