const express = require('express');
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "trishantkaiseho@88"

//* Route 1 --> "SIGNUP" - '/auth/createuser'
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 6 }),
    body('phone', 'Enter a valid phone').isLength({ min: 10, max: 10 }),
    body('password', 'set password of atleast 5 character').isLength({ min: 5 })
], async (req, res) => {

    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry! User with email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: secPass
        });

        // Gettin User Id of the user to sent it to the auth-token to verify user at the time of login
        const data = {
            user: {
                id: user.id
            }
        }

        //? Sending a Authorization token to the user after successful login
        // Adding User Id of the user in the auth-token
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });


    } catch (error) {
        console.log(error.message)
        res.status(500).send("Some error occured")

    }
})

//* Route 2 --> "LOGIN" - '/auth/login'
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'set password of atleast 5 character').isLength({ min: 5 })
], async (req, res) => {

    let success = false;
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({ error: "please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "please try to login with correct credentials" });
        }

        // Checking authorized token
        const data = {
            user: {
                id: user.id
            }
        }

        // Signing authorization token
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error occured")
    }
})


//* Route 3 --> "LOGIN" - '/auth/getuser'
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        // Getting User Id of user coming from fetchuser
        const userId = req.user.id;
        // It will fetch all the details of the loged In user except "password"
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error occured")
    }
})

module.exports = router