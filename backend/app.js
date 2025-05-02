const express = require('express')
const socket = require("socket.io")
const app = express()
const http = require("http")
const server = http.createServer(app)
require("dotenv").config()
const cors = require("cors")
const port = 3000
const orderModel = require("./models/order-model")
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// // For REST APIs

app.use(cors());


const io = socket(server, {
    cors: {}
});



const DB = require("./db/db")
DB()
const adminAuthRoute = require("./routes/admin-routes/adminAuth-route")
const adminRoute = require("./routes/admin-routes/admin-route")
const normalRoute = require("./routes/normal-route")
const userRoute = require("./routes/user-routes/user-route")
const userAuthRoute = require("./routes/user-routes/auth-route")

app.get('/', (req, res) => res.send('Welcome to Birat Biryani House Server.'))
app.get('/keep-alive', (req, res) => res.send('pong.'))




app.use("/api", normalRoute)

app.use("/api/admin", adminAuthRoute)
app.use("/api/admin", adminRoute)

app.use("/api/auth/user", userAuthRoute)
app.use("/api/user", userRoute)

let adminId


io.on("connection", (socket) => {
    socket.on("admin-connect", (id) => {
        adminId = id
        socket.join(id)
    })


    socket.on("create-order", async (Data) => {
        try {
            if (Data && Data.product.length > 0) {
                const orderTotalPrice = Data.product.reduce((all, item) => all + item.productTotalPrice, 0)

                const order = await orderModel.create({
                    foodDetails: Data.product,
                    full_name: Data.full_name,
                    ph_num: Data.ph_num,
                    address: Data.address,
                    paymentMethod: Data.paymentMethod,
                    totalOrderPrice: orderTotalPrice,
                    user: Data.id
                })
                if (order) {
                    io.emit("create-product-success", order)
                    io.to(adminId).emit("new-order", order)
                } else {
                    io.emit("create-product-failure", { msg: "Order creation failed." })


                }
            }

        } catch (err) {
            io.emit("create-order-failure", { msg: "Order creation failed." })

        }

    })
})


server.listen(port)