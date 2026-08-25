const foodPartnerModel = require("../models/foodpartner.model")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require('../services/tokenBlacklist.service');


async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }
    
    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
        return res.status(401).json({
            message: "Token has been revoked. Please login again."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        req.foodPartner = foodPartner

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }

}

async function authUserMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }
    
    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
        return res.status(401).json({
            message: "Token has been revoked. Please login again."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id);

        req.user = user

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }

}   

async function authUserOrFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Try to find as food partner first
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        
        if (foodPartner) {
            req.foodPartner = foodPartner;
            return next();
        }

        // If not food partner, try as user
        const user = await userModel.findById(decoded.id);
        
        if (user) {
            req.user = user;
            return next();
        }

        // If neither found
        return res.status(401).json({
            message: "Invalid token"
        })

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
    authUserOrFoodPartnerMiddleware
}