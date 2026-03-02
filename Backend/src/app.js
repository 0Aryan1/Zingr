const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route.js');

const app = express();
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res) => {
    res.send("Hello Aryan");
})

app.use('/api/auth', authRoutes);

module.exports = app;