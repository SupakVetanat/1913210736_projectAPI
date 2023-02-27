const Brand = require('../models/brand')
const Product = require('../models/product')
const config = require('../config/index.js')
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)

const { validationResult } = require('express-validator');


exports.index = async (req, res, next) => {

  const brand = await Brand.find().sort({ _id: -1 })
  const brandInfo = await brand.map((brand, index) => {
    return {
      id: brand.id,
      name: brand.name,
      location: brand.location,
    }
  });

  res.status(200).json({
    data: brandInfo
  })
}

exports.product = async (req, res, next) => {
  const product = await Product.find().populate('brand').select('name price shop')

  res.status(200).json({
    data: product
  })
}

exports.byid = async (req, res, next) => {
  const { id } = req.params
  const product = await Brand.findById({ _id: id }).populate('product')

  res.status(200).json({
    data: product
  })
}

exports.prodbyid = async (req, res, next) => {
    const { id } = req.params
    const product = await Product.find({ brand: id }).populate('product')
  
    res.status(200).json({
      data: product
    })
  }

exports.insert = async (req, res, next) => {
    try {
      const { name, location } = req.body
  
      //validaion
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
        error.statusCode = 422;
        error.validation = errors.array()
        throw error;
      }
  
  
      let brand = new Brand({
        name: name,
        location: location
      })
      await brand.save()
  
      res.status(200).json({
        message: "เพิ่มข้อมูลแบรนด์เรียบร้อยแล้ว"
      })
    } catch (error) {
      next(error)
    }
  }

  exports.insertprod = async (req, res, next) => {
    try {
      var { name, brand,price } = req.body
      const brandInfo = await Brand.findOne({ name: brand })

      //validaion
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
        error.statusCode = 422;
        error.validation = errors.array()
        throw error;
      }
  
      let product = new Product({
        name: name,
        price:price,
        brand: brandInfo._id
      })
      await product.save()
  
      res.status(200).json({
        message: "เพิ่มข้อมูลสินค้าเรียบร้อยแล้ว",
        data: brandInfo
      })
    } catch (error) {
      next(error)
    }
  }
