const Product = require('../models/product')
const Order = require('../models/order')

const { validationResult } = require('express-validator');


exports.order = async (req, res, next) => {
    const order = await Order.find().populate('product user')
  
    res.status(200).json({
      data: order
    })
  }


exports.purchase = async (req, res, next) => {

    try {

        const { id } = req.params
        const { amount,color } = req.body
        const productInfo = await Product.findOne({ _id: id })

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
          error.statusCode = 422;
          error.validation = errors.array()
          throw error;
        }
        const product = await Product.findOneAndUpdate({ _id: id }, {
            name: productInfo.name,
            brand: productInfo.brand,
            price: productInfo.price,
            description: productInfo.description,
            QTY: productInfo.QTY - amount
        })

        let order = new Order({
            product: productInfo._id,
            user:req.user,
            amount: amount,
            color:color
        })
        await order.save()

        if (!product) {
            const error = new Error("ไม่พบข้อมูลแบรนด์");
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({
            message: "สั่งซื้อสำเร็จ",
            data: order
        });

    } catch (error) {
        next(error);
    }
}
