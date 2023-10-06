const slugify = require("slugify")
const { check } = require("express-validator")
const validatorMiddleware = require("../middlewares/validatorMiddleware")
const User = require("../schemas/userModule")
const AppError = require("../utils/appError")

exports.signupValidator = [
    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new AppError("Password Confirmation incorrect", 500)
            }
            return true
        }),

    check("passwordConfirm").notEmpty().withMessage("Password confirmation required"),

    validatorMiddleware,
]

exports.loginValidator = [
    check("email").notEmpty().withMessage("Email required").isEmail().withMessage("Invalid email address"),

    check("password").notEmpty().withMessage("Password required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    validatorMiddleware,
]
