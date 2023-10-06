const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please tell us your name"],
        minlength: [8, "Username must be at least 8 characters long"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a valid password"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    // passwordConfirm: {
    //     type: String,
    //     required: [true, "Please confirm your password"],
    //     validate: {
    //         validator: function (el) {
    //             // Compare with the temporarily saved plain password before hashing
    //             return el === this.password
    //         },
    //         message: "Passwords do not match",
    //     },
    // },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
    todolist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List",
        },
    ],
})

// Middleware to temporarily save plain password before hashing
// userSchema.pre("save", async function (next) {
//     // Only hash the password if it's modified (or new)
//     if (!this.isModified("password")) return next()

//     // Hash the password
//     this.password = await bcrypt.hash(this.password, 10)

//     // Temporarily save the plain password for validation
//     this.password = this.passwordConfirm

//     // Continue with the save operation
//     next()
// })

userSchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", userSchema)

module.exports = { User }
