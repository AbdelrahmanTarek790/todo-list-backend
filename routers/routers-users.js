const express = require("express")
const { signup, signin, getUser, getAllUsers } = require("../controllers/authContorllers")
const { signupValidator } = require("../validators/authValidator")
const router = express.Router()

router.post("/signup", signupValidator, signup)

router.post("/signin", signin)

router.get("/users", getAllUsers)

router.get("/users/:id", getUser)

module.exports = router
