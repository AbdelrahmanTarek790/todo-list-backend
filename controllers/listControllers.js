const express = require("express")
const { List } = require("../schemas/listModule") // Adjust the path as needed
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const { User } = require("../schemas/userModule")

exports.postList = catchAsync(async (req, res, next) => {
    const { title, date, userId } = req.body

    if (!userId) {
        return next(new AppError("Unauthorized please login", 401))
    }
    const existingUser = User.findById(userId)
    if (!existingUser) {
        return next(new AppError("No User Found", 404))
    }

    const list = new List({ title, date, userId })
    await list.save()

    await User.findByIdAndUpdate(userId, { $push: { todolist: list._id } })

    res.status(201).json(list)
})

// exports.getList = catchAsync(async (req, res, next) => {
//     const userId = req.params.id
//     console.log(userId)
//     const user = await User.findById(userId).populate("todolist")
//     if (!user) {
//         return res.status(404).json({ error: "User not found" })
//     }
//     const filteredTodolist = user.todolist.filter((item) => ["Complete", "Assigned", "In Progress"].includes(item.done))
//     res.json(filteredTodolist)
// })
exports.getList = catchAsync(async (req, res, next) => {
    const userId = req.params.id
    console.log(userId)

    const user = await User.findById(userId).populate("todolist")
    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    // Filter the todolist items based on the "Complete," "Assigned," and "In Progress" values
    const filteredTodolist = user.todolist.filter((item) => ["Complete", "Assigned", "In Progress"].includes(item.done))

    const groupedTodolist = {}

    const counts = {
        "In Progress": 0,
        Assigned: 0,
        Complete: 0,
    }

    filteredTodolist.forEach((item) => {
        // Combine "In Progress" and "Assigned" into the same group

        if (item.done === "In Progress" || item.done === "Assigned" || item.done === "Complete") {
            counts[item.done]++
        }
        const doneStatus = item.done === "Assigned" ? "In Progress" : item.done

        if (!groupedTodolist[doneStatus]) {
            groupedTodolist[doneStatus] = []
        }
        groupedTodolist[doneStatus].push(item)
    })

    // Calculate the total number of projects
    const totalProjects = filteredTodolist.length

    // Include the totalProjects in the response
    const response = {
        counts,
        groupedTodolist,
        totalProjects,
    }

    res.json(response)
})
exports.changeDone = catchAsync(async (req, res, next) => {
    try {
        const listId = req.params.id
        const { done } = req.body

        // Validate the 'done' field to ensure it's one of the allowed values
        if (!["Complete", "Assigned", "In Progress"].includes(done)) {
            return res.status(400).json({ message: "Invalid 'done' value" })
        }

        // Find the List document by its ID and update the 'done' field
        const updatedList = await List.findByIdAndUpdate(
            listId,
            { done },
            { new: true } // To return the updated document
        )

        if (!updatedList) {
            return res.status(404).json({ message: "List not found" })
        }

        res.status(200).json(updatedList)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
})
