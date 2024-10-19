const connectToMongo = require("./db")
const express = require('express')
var cors = require('cors')
require('dotenv').config();
const ROUTE_URL = process.env.ROUTE_URL;

connectToMongo();

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.use('/auth', require('./routes/auth'))
app.use('/ques', require('./routes/ques'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
