const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
// const productRoutes = require("./routers/routers-product")
const userRouters = require("./routers/routers-users")
const listRouters = require("./routers/routers-list")
// const orderRouters = require("./routers/routers-orders")
const AppError = require("./utils/appError")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
// app.use(cookieParser())
// app.use(
//     session({
//         secret: "ajsdhgjskdgsdglasd", // Change this to a secure, random string
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             secure: false, // Set to true in production with HTTPS
//             maxAge: 7776000000, // Session expiration time in milliseconds (90 days)
//         },
//     })
// )

app.use("/uploads", express.static("uploads"))
// app.use("/api", productRoutes)

app.use("/api/v2", userRouters, listRouters)

// app.use("/api", orderRouters)

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use((err, req, res, next) => {
    // Check if the error is an instance of your AppError class
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }

    console.log(err)
    // Handle other errors
    res.status(400).json({
        status: "error",
        message: err.errors,
        statusCode: err.code,
    })
})

module.exports = app
