const mongoose = require("mongoose")
const validator = require("validator")
// Define the Product Schema
const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Provide a title"],
    },
    date: {
        type: String,
        required: [true, "Please Provide a date"],
    },
    done: {
        enum: ["Complete", "Assigned", "In Progress"],
        type: String,
        default: "In Progress",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
})

// Create and export the models
const List = mongoose.model("List", listSchema)

module.exports = { List }
