const mongoose = require("mongoose");
require('dotenv').config();
const DB_URL = process.env.DB_URL;

const connectToMongo = async () => {
    try {
        mongoose.connect(DB_URL).then(() => {
            console.log("DB Connected")
        })
    } catch (err) {
        console.log("Not connected");
    }
}

module.exports = connectToMongo;