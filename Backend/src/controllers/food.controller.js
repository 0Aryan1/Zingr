const foodModel = require("../models/food.model")
const storageService = require('../services/storage.service');
const { v4: uuid } = require("uuid")

async function createFood(req, res) {
    try {
        if (!req.foodPartner) {
            return res.status(401).json({
                message: "Unauthorized. Please login as a food partner first."
            });
        }

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })

        res.status(201).json({
            message: "food created successfully",
            food: foodItem
        })
    } catch (error) {
        console.error("Create food error:", error);
        res.status(500).json({
            message: "Failed to create food item",
            error: error.message
        });
    }
}

async function getFoodItems(req, res) {
    try {
        const foodItems = await foodModel.find();
        
        res.status(200).json({
            message: "Food items fetched successfully",
            foods: foodItems
        });
    } catch (error) {
        console.error("Get food items error:", error);
        res.status(500).json({
            message: "Failed to retrieve food items",
            error: error.message
        });
    }
}

module.exports = {
    createFood,
    getFoodItems
}