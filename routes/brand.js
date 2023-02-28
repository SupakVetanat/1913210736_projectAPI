var express = require('express');
var router = express.Router();
const brandcController = require('../controllers/brandcontroller');

const passportJWT = require('../middleware/passportJWT')
const chackAdmin = require('../middleware/checkAdmin')
const { body } = require('express-validator');

router.get('/', brandcController.index);
router.get('/prod', brandcController.product);
router.get('/:id', brandcController.byid);
router.get('/prod/:id', brandcController.prodbyid);

router.put('/:id',[passportJWT.isLogin], brandcController.update);
router.delete('/:id',[passportJWT.isLogin,chackAdmin.isAdmin], brandcController.destroy);

router.put('/prod/:id',[passportJWT.isLogin], brandcController.updateProd);
router.delete('/prod/:id',[passportJWT.isLogin,chackAdmin.isAdmin], brandcController.destroyProd);


router.post('/', [
    body("name").not().isEmpty().withMessage("กรุณากรอกชื่อแบรนด์"),
    body("location.lat").not().isEmpty().withMessage("กรุณากรอกค่า Lat ").isNumeric().withMessage("Lat ต้องเป็นตัวเลขเท่านั้น"),
    body("location.lgn").not().isEmpty().withMessage("กรุณากรอกค่า Lgn ").isNumeric().withMessage("Lgn ต้องเป็นตัวเลขเท่านั้น"),
], brandcController.insert);

router.post('/prod', [
    body("name").not().isEmpty().withMessage("กรุณากรอกชื่อสินค้า"),
    body("price").not().isEmpty().withMessage("กรุณากรอกราคา").isNumeric().withMessage("ราคาต้องเป็นตัวเลขเท่านั้น"),
    body("brand").not().isEmpty().withMessage("กรุณากรอกชื่อแบรนด์"),
], brandcController.insertprod);


module.exports = router;
