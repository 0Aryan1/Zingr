const mongoose  = require('mongoose');
const {DB_NAME} =  require("../constants.js")

async function connectDB(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // database connection mongodb atlas
        console.log(`\n MongoDB connected !! DB Host ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("mongodb connection Failed",error)
        process.exit(1)
    }
}

module.exports = connectDB