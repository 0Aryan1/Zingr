const mongoose  = require('mongoose');
const {DB_NAME} =  require("../constants.js")

async function connectDB(){
    try {
        // MongoDB URI might already include database name in Atlas
        // Check if URI already has database, otherwise append it
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        
        // If URI doesn't end with a database name, append it
        const connectionString = mongoURI.includes('mongodb.net/') && !mongoURI.includes('?') 
            ? `${mongoURI}?retryWrites=true&w=majority`
            : mongoURI;
        
        const connectionInstance = await mongoose.connect(connectionString, {
            dbName: DB_NAME, // Explicitly set database name
            serverSelectionTimeoutMS: 30000, // Increase timeout for serverless
            socketTimeoutMS: 45000,
            maxPoolSize: 10, // Limit connection pool for serverless
            minPoolSize: 1
        });
        
        console.log(`\n MongoDB connected !! DB Host ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.log("mongodb connection Failed", error);
        throw error; // Throw instead of exit for better error handling
    }
}

module.exports = connectDB