const { validationResult } = require("express-validator")

// @desc  Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: { password: { kind: "required", message: "Password Confirmation incorrect", name: "ValidatorError", path: "password" } },
            status: "error",
        })
    }
    next()
}

module.exports = validatorMiddleware
