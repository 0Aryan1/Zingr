// Vercel serverless entry point
const app = require('./src/app');
const connectDB = require('./src/db/db');

// Connect to MongoDB on cold start
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = connectDB().then(() => {
            console.log('MongoDB connected for serverless');
            return true;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

// Initialize DB connection
dbConnect().catch(err => console.error('DB connection error:', err));

// Export the Express app
module.exports = app;
