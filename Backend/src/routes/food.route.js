const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleWare = require("../middlewares/auth.middleware")
const multer = require('multer');
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
})

/* POST /api/food/ [protected] */
router.post('/',authMiddleWare.authFoodPartnerMiddleware,
    upload.single('video'),
    foodController.createFood)

/* GET /api/food/ [protected] */
router.get("/",
    authMiddleWare.authUserMiddleware,
    foodController.getFoodItems)



module.exports = router;