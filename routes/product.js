var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

const passportJWT = require('../middleware/passportJWT')
const chackAdmin = require('../middleware/checkAdmin')
const { body } = require('express-validator');

router.get('/order',[passportJWT.isLogin,chackAdmin.isAdmin], productController.order);
router.post('/:id',[passportJWT.isLogin, 
    body("amount").not().isEmpty().withMessage("กรุณากรอกจำนวน").isNumeric().withMessage("amount ต้องเป็นตัวเลขเท่านั้น"),
    body("color").not().isEmpty().withMessage("กรุณากรอกสีที่ต้องการ"),]
    , productController.purchase);

module.exports = router;