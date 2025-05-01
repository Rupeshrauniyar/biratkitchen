const mongoose = require("mongoose")
require("dotenv").config()
const DBURL = process.env.DB_URL
const DB = async () => {
    try {
        await mongoose.connect(DBURL).then(() => {
            try {

            } catch (err) {

            }
        })
    } catch (err) {
    }
}

module.exports = DB