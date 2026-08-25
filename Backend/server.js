require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

// Database connection state
let dbConnected = false;

// Connect to database (for serverless, this happens on cold start)
(async () => {
    try {
        if (!dbConnected) {
            await connectDB();
            dbConnected = true;
            console.log('Database connected successfully');
        }
    } catch (err) {
        console.error("Failed to connect to database", err);
    }
})();

// For local development only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export app for Vercel
module.exports = app;