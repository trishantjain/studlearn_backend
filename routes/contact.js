const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
// const { body, validationResult } = require('express-validator')
const Contact = require('../models/Contact')

router.post('/addquery', async (req, res) => {
    try {
        queryMsg = await Contact.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        })

        res.status(200).send("Query executed");
        console.log("data updated to db")
    } catch (error) {
        res.status(500).send("Add query catch block");
    }
})

module.exports = router