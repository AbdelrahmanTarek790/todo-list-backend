const express = require("express")
const { User } = require("../schemas/userModule") // Adjust the path as needed
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    res.cookie("token", token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // secure: true,
        httpOnly: true,
    })
    res.status(statusCode).json({
        status: "success",
        message: "User registered successfully",
        token,
        user,
    })
}

// exports.signup = catchAsync(async (req, res, next) => {
//     const { username, password, email, passwordConfirm } = req.body

//     // Check if the username or email already exists
//     const existingUser = await User.findOne({ email })

//     if (existingUser) {
//         return next(new AppError("Email already exists", 500))
//     }

//     const newUser = new User({
//         username,
//         password, // Use the hashed password
//         email,
//         passwordConfirm,
//     })

//     await newUser.save()

//     // const token = jwt.sign({ userId: newUser._id, role: newUser.role }, "secretkey", {
//     //     expiresIn: "1000d",
//     // })

//     const userToSend = {
//         _id: newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//         role: newUser.role,
//         // Add other fields you want to include in the response
//     }
//     createSendToken(userToSend, 201, res)
//     // res.status(201).json({ message: "User registered successfully", newUser, token })
// })

exports.signup = catchAsync(async (req, res, next) => {
    const { username, password, email, passwordConfirm } = req.body

    // Check if the username or email already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return next(new AppError("Email already exists", 500))
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
        username,
        password: hashedPassword, // Use the hashed password
        email,
    })

    await newUser.save()
    // req.session.userId = newUser._id
    const userToSend = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        // Add other fields you want to include in the response
    }
    createSendToken(userToSend, 201, res)
    // res.status(201).json({ message: "User registered successfully", newUser, token })
})

exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
        return next(new AppError("Invalid email or password", 401))
    }

    console.log();
    // Compare the provided password with the hashed password
    const passwordMatch = await user.correctPassword(password)

    if (!passwordMatch) {
        return next(new AppError("Invalid email or password", 401))
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, "secretkey", {
        expiresIn: "1000d",
    })
    // req.session.userId = user._id
    const userToSend = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        // Add other fields you want to include in the response
    }

    res.status(200).json({ message: "Authentication successful", token, user: userToSend })
})

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const projection = { password: 0, passwordConfirm: 0 }

    // Fetch users from the database, excluding specified fields
    const users = await User.find({}, projection)

    res.status(200).json(users)
})

exports.getUser = catchAsync(async (req, res, next) => {
    const idOrEmailOrPhone = req.params.id

    const projection = { password: 0, passwordConfirm: 0 }

    if (/^[0-9a-fA-F]{24}$/.test(idOrEmailOrPhone)) {
        // If it matches the ObjectId format, assume it's an _id
        const user = await User.findById(idOrEmailOrPhone, projection)

        if (!user) {
            return next(new AppError("User not found", 404))
        }

        return res.status(200).json(user)
    }

    // Fetch users from the database, excluding specified fields
    const users = await User.findOne(
        {
            $or: [{ email: idOrEmailOrPhone }, { phone: idOrEmailOrPhone }],
        },
        projection
    )

    if (!users) {
        return next(new AppError("User not found", 404))
    }

    res.status(200).json(users)
})
