const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route.js');
const foodRoutes = require('./routes/food.route.js');
const foodPartnerRoutes = require('./routes/food-partner.route.js');
const cors = require('cors');

const app = express();

// CORS configuration - allow both local and production URLs
//
// Note: with the /api rewrite in the frontend's vercel.json, the browser now
// talks to the API on its own origin, so these checks are a fallback for
// direct calls rather than the main path.
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://zingr-eta.vercel.app",  // Production frontend URL
    process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

// Vercel gives every deployment its own hostname, so a preview or alias link
// opened on a new device was rejected outright. Scoped to this project's
// hostnames rather than all of *.vercel.app, which would be far too broad
// given credentials are allowed.
const VERCEL_PREVIEW = /^https:\/\/zingr-[a-z0-9-]+\.vercel\.app$/;

function isAllowedOrigin(origin) {
    return allowedOrigins.includes(origin) || VERCEL_PREVIEW.test(origin);
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (isAllowedOrigin(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            const error = new Error('Not allowed by CORS');
            error.status = 403;
            error.origin = origin;
            callback(error);
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

// 404 for unmatched API paths, so a typo returns JSON rather than Express's
// default HTML.
app.use('/api', (req, res) => {
    res.status(404).json({ message: `No such endpoint: ${req.method} ${req.originalUrl}` });
});

/**
 * Error handler. There was none before, so a rejected CORS origin fell through
 * to Express's default handler and produced an HTML 500 with no CORS headers —
 * which a browser surfaces as an opaque network failure rather than anything
 * a developer or user can act on.
 *
 * Note this deliberately does NOT add Access-Control-Allow-Origin for a
 * rejected origin — that would defeat the check. The browser still cannot read
 * the body; the gain is a clean status, a server-side log naming the origin,
 * and a response that is debuggable with curl.
 */
// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity
app.use((err, req, res, next) => {
    const status = err.status || 500;

    if (err.message === 'Not allowed by CORS') {
        console.error('CORS rejected origin:', err.origin);
        return res.status(403).json({
            message: 'This origin is not allowed to call the Zingr API.',
            origin: err.origin || null
        });
    }

    console.error('Unhandled error:', err);
    res.status(status).json({
        message: 'Something went wrong on the server.',
        error: err.message
    });
});

module.exports = app;