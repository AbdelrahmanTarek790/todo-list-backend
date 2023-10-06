const express = require("express")
const { postList, getList, changeDone } = require("../controllers/listControllers")
// const { signup, signin, getUser, getAllUsers } = require("../controllers/authContorllers")
const router = express.Router()

router.post("/list", postList)

router.get("/list/:id", getList)
router.put("/list/:id", changeDone)
// router.get("/list/:id", getUser)

module.exports = router
