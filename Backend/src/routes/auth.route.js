const express = require('express')
const authController = require("../controllers/auth.controller")

const router = express.Router()

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)

// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)

// Generic logout (works for both user and food partner)
router.post('/logout', authController.logoutUser)

// Check authentication status
router.get('/check', authController.checkAuth)

module.exports = router