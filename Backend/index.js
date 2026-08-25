// Vercel serverless entry point
require('dotenv').config();
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
        }).catch(err => {
            console.error('MongoDB connection failed:', err);
            cached.promise = null; // Reset promise so it can retry
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        cached.promise = null;
        throw err;
    }
}

// Wrapper to ensure DB is connected before handling requests
module.exports = async (req, res) => {
    try {
        // Ensure database is connected
        await dbConnect();
        // Handle the request with Express app
        return app(req, res);
    } catch (error) {
        console.error('Request handler error:', error);
        return res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
};
