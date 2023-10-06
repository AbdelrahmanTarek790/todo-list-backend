const mongoose = require("mongoose")
const dotenv = require("dotenv")

require("dotenv").config()

process.on("uncaughtException", (err) => {
    console.log("uncaughtException! Shutting down... ")
    console.log(err.name, err.message)
})

dotenv.config({ path: "./config.env" })

const app = require("./app")

const uri2 = `${process.env.DB_URI}`
const atlas = "mongodb+srv://abdelrahmantarek790:jPPnQx68SfmbkEzShjEakjqpLZJ9rtq5WJdsD5rw3bDfzCygLJUtUqpQrV6zfCP5@pharmacy.8lnjuam.mongodb.net/db"
mongoose
    .connect(uri2, {
        dbName: `tododb`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error)
    })

const port = process.env.PORT || 8080
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED Rejection! Shutting down... ")
    console.log(err.name, err.message)

    server.close(() => {
        process.exit(1) // zero stands for success and one stands for uncaught exception);
    })
})
