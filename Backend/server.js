require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

// Connect to database
connectDB()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.log("Failed to connect to database", err);
        process.exit(1);
    });

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export for Vercel serverless
module.exports = app;