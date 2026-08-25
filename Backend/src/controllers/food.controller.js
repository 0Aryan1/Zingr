const foodModel = require("../models/food.model")
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
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

        // Decorate each reel with this user's like/save state so the client can
        // render a filled heart and bookmark on first paint. Previously the
        // feed carried no per-user flags at all, so liked state was lost on
        // every reload. Two indexed lookups, regardless of feed size.
        const foodIds = foodItems.map((food) => food._id);

        const [likedDocs, savedDocs] = await Promise.all([
            likeModel.find({ user: req.user._id, food: { $in: foodIds } }).select('food').lean(),
            saveModel.find({ user: req.user._id, food: { $in: foodIds } }).select('food').lean()
        ]);

        const likedIds = new Set(likedDocs.map((doc) => String(doc.food)));
        const savedIds = new Set(savedDocs.map((doc) => String(doc.food)));

        const foods = foodItems.map((food) => ({
            ...food.toObject(),
            isLiked: likedIds.has(String(food._id)),
            isSaved: savedIds.has(String(food._id))
        }));

        res.status(200).json({
            message: "Food items fetched successfully",
            foods
        });
    } catch (error) {
        console.error("Get food items error:", error);
        res.status(500).json({
            message: "Failed to retrieve food items",
            error: error.message
        });
    }
}

/**
 * Adjust a counter and never let it settle below zero. Counts could previously
 * drift negative, because the $inc and the like/save document write are not in
 * a transaction and nothing bounded the decrement.
 */
async function bumpCount(foodId, field, delta) {
    const updated = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { [field]: delta } },
        { returnDocument: 'after' }
    );

    if (updated && updated[field] < 0) {
        updated[field] = 0;
        await updated.save();
    }

    return updated ? updated[field] : 0;
}

async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const food = await foodModel.findById(foodId).select('_id');
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        // Delete-and-report in one step. The old read-then-delete left a window
        // where two concurrent requests both saw "already liked".
        const removed = await likeModel.findOneAndDelete({
            user: user._id,
            food: foodId
        });

        if (removed) {
            const likeCount = await bumpCount(foodId, 'likeCount', -1);
            return res.status(200).json({
                message: "Food unliked successfully",
                isLiked: false,
                likeCount
            });
        }

        try {
            const like = await likeModel.create({
                user: user._id,
                food: foodId
            });

            const likeCount = await bumpCount(foodId, 'likeCount', 1);

            return res.status(201).json({
                message: "Food liked successfully",
                like,
                isLiked: true,
                likeCount
            });
        } catch (error) {
            // The unique (user, food) index rejected a duplicate: a concurrent
            // request already recorded this like. Report the existing state
            // rather than incrementing a second time.
            if (error && error.code === 11000) {
                const current = await foodModel.findById(foodId).select('likeCount');
                return res.status(200).json({
                    message: "Food already liked",
                    isLiked: true,
                    likeCount: current ? current.likeCount : 0
                });
            }
            throw error;
        }
    } catch (error) {
        console.error("Like food error:", error);
        res.status(500).json({
            message: "Failed to like food",
            error: error.message
        });
    }
}

async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const food = await foodModel.findById(foodId).select('_id');
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        const removed = await saveModel.findOneAndDelete({
            user: user._id,
            food: foodId
        });

        if (removed) {
            const savesCount = await bumpCount(foodId, 'savesCount', -1);
            return res.status(200).json({
                message: "Food unsaved successfully",
                isSaved: false,
                savesCount
            });
        }

        try {
            const save = await saveModel.create({
                user: user._id,
                food: foodId
            });

            const savesCount = await bumpCount(foodId, 'savesCount', 1);

            return res.status(201).json({
                message: "Food saved successfully",
                save,
                isSaved: true,
                savesCount
            });
        } catch (error) {
            if (error && error.code === 11000) {
                const current = await foodModel.findById(foodId).select('savesCount');
                return res.status(200).json({
                    message: "Food already saved",
                    isSaved: true,
                    savesCount: current ? current.savesCount : 0
                });
            }
            throw error;
        }
    } catch (error) {
        console.error("Save food error:", error);
        res.status(500).json({
            message: "Failed to save food",
            error: error.message
        });
    }
}

async function getSaveFood(req, res) {
    try {
        const user = req.user;

        const savedFoods = await saveModel.find({ user: user._id }).populate('food');

        // A save whose food was deleted populates as null. Passing those on
        // made every client unwrap `.food._id` on nothing.
        const withFood = savedFoods.filter((entry) => entry.food);

        if (withFood.length === 0) {
            return res.status(200).json({
                message: "No saved foods found",
                savedFoods: []
            });
        }

        res.status(200).json({
            message: "Saved foods retrieved successfully",
            savedFoods: withFood
        });
    } catch (error) {
        console.error("Get saved foods error:", error);
        res.status(500).json({
            message: "Failed to retrieve saved foods",
            error: error.message
        });
    }
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}