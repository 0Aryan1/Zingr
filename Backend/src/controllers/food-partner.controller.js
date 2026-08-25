const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {
    try {
        const foodPartnerId = req.params.id;

        // Never return the bcrypt hash. The previous version spread the whole
        // document, so any authenticated caller viewing any restaurant page
        // received that partner's password hash and email.
        const foodPartner = await foodPartnerModel
            .findById(foodPartnerId)
            .select('-password')

        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

        // Email is a contact detail for the account owner, not public storefront
        // data — include it only when the partner is viewing their own page.
        const isOwner =
            req.foodPartner && String(req.foodPartner._id) === String(foodPartnerId);

        const partner = foodPartner.toObject();
        if (!isOwner) {
            delete partner.email;
        }

        res.status(200).json({
            message: "Food partner retrieved successfully",
            foodPartner: {
                ...partner,
                foodItems: foodItemsByFoodPartner
            }

        });
    } catch (error) {
        console.error("Get food partner error:", error);
        res.status(500).json({
            message: "Failed to retrieve food partner",
            error: error.message
        });
    }
}

module.exports = {
    getFoodPartnerById
};