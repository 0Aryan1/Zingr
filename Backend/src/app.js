const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route.js');
const foodRoutes = require('./routes/food.route.js');
const foodPartnerRoutes = require('./routes/food-partner.route.js');
const cors = require('cors');

const app = express();

// CORS configuration - allow both local and production URLs
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://zingr-eta.vercel.app",  // Production frontend URL
    process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res) => {
    res.send("Hello Aryan - Backend is Live!");
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;