const mongoose = require("mongoose");
require('dotenv').config();
const DB_URL = process.env.DB_URL;
const mongoURI = `${DB_URL}/studLearn`

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log("Mongoose Connected...");
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

module.exports = connectToMongo;