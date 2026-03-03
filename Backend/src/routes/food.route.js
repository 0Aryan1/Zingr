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

/* GET /api/food/ [private] */
router.get("/",
    authMiddleWare.authUserMiddleware,
    foodController.getFoodItems)

router.post('/like',
    authMiddleWare.authUserMiddleware,
    foodController.likeFood)


router.post('/save',
    authMiddleWare.authUserMiddleware,
    foodController.saveFood
)


router.get('/save',
    authMiddleWare.authUserMiddleware,
    foodController.getSaveFood
)



module.exports = router;