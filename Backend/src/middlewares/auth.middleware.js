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

        // A valid signature is not proof the account still exists, and a user
        // token carries an id that is not in this collection. Without this
        // check req.foodPartner was set to null and the handler crashed on it.
        if (!foodPartner) {
            return res.status(401).json({
                message: "Food partner account not found. Please login again."
            })
        }

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

        // Same guard as above. A food-partner token reaching a user-only route
        // resolved to null here, and likeFood/saveFood then threw on user._id
        // — a 500 where a 401 belongs.
        if (!user) {
            return res.status(401).json({
                message: "User account not found. Please login again."
            })
        }

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