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
  const product = await Product.find().populate('brand').select('name price brand description')

  res.status(200).json({
    data: product
  })
}

exports.byid = async (req, res, next) => {
  const { id } = req.params
  const brand = await Brand.findById({ _id: id }).populate('product')

  res.status(200).json({
    data: brand
  })
}

exports.prodbyid = async (req, res, next) => {
  const { id } = req.params
  const product = await Product.findById({ _id: id }).populate('product')

  res.status(200).json({
    data: product
  })
}

exports.prodbyidBrand = async (req, res, next) => {
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

    const checkBrand = await Brand.find({ name: name })

    if(!checkBrand[0]){
      let brand = new Brand({
        name: name,
        location: location
      })
      await brand.save()
  
      res.status(200).json({
        message: "เพิ่มข้อมูลแบรนด์เรียบร้อยแล้ว"
      })
    }
    else{
      const error = new Error("แบรนด์ที่ท่านกรอกมีข้อมูลอยู่แล้วในระบบ");
      error.statusCode = 422;
      throw error;
    }

    
  } catch (error) {
    next(error)
  }
}

exports.insertprod = async (req, res, next) => {
  try {
    var { name, brand, price,description } = req.body
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
      price: price,
      brand: brandInfo._id,
      description: description,
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


exports.update = async (req, res, next) => {

  try {

    const { id } = req.params
    const { name, location: { lat,lgn } } = req.body

    const brand = await Brand.findOneAndUpdate({ _id: id }, {
      name: name,
      location: { lat: lat,lgn:lgn }
    })

    if (!brand) {
      const error = new Error("ไม่พบข้อมูลแบรนด์");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      message: "แก้ไขข้อมูลเรียบร้อยแล้ว",
    });

  } catch (error) {
    next(error);
  }
}


exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params

    const brand = await Brand.deleteOne({
      _id: id
    })
    console.log(brand)

    if (brand.deletedCount === 0) {
      const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูลผู้ใช้งาน");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: "ลบข้อมูลเรียบร้อยแล้ว"
      })
    }

  } catch (error) {
    next(error)
  }
}


exports.updateProd = async (req, res, next) => {

  try {

    const { id } = req.params
    const { name, brand, price,description } = req.body
    const brandInfo = await Brand.findOne({ name: brand })

    const product = await Product.findOneAndUpdate({ _id: id }, {
      name: name,
      brand: brandInfo._id,
      price: price,
      description: description,
    })

    if (!product) {
      const error = new Error("ไม่พบข้อมูลแบรนด์");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      message: "แก้ไขข้อมูลเรียบร้อยแล้ว",
    });

  } catch (error) {
    next(error);
  }
}


exports.destroyProd = async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await Product.deleteOne({
      _id: id
    })
    console.log(product)

    if (product.deletedCount === 0) {
      const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูลผู้ใช้งาน");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: "ลบข้อมูลเรียบร้อยแล้ว"
      })
    }

  } catch (error) {
    next(error)
  }
}