var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

const { body } = require('express-validator');
const passportJWT = require('../middleware/passportJWT')

/* GET users listing. */

router.post('/',[
    body('name').not().isEmpty().withMessage("กรุณากรอกชื่อ-สกุล"),
    body('email').not().isEmpty().withMessage("กรุณากรอกอีเมล").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่าน").isLength({min:5}).withMessage("รหัสผ่านต้องอย่างน้อย5ตัวอักษร"),
], userController.register);

router.post('/login',[
    // body('name').not().isEmpty().withMessage("กรุณากรอกชื่อ-สกุล"),
    body('email').not().isEmpty().withMessage("กรุณากรอกอีเมล").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่าน").isLength({min:5}).withMessage("รหัสผ่านต้องอย่างน้อย5ตัวอักษร"),
],userController.login );

router.get('/me',[passportJWT.isLogin],userController.profile)

module.exports = router;
