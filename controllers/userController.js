const User = require("../models/user")
const { validationResult } = require('express-validator');
const { response } = require("express");
const jwt = require("jsonwebtoken");
const config = require('../config/index.js');


exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //validaion
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array()
      throw error;
    }

    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      const error = new Error("อีเมลนี้มีผู้ใช้งานในระบบแล้ว");
      error.statusCode = 400;
      throw error;
    }


    let user = new User();
    user.name = name;
    user.email = email;
    user.password = await user.encryptPassword(password);

    await user.save();

    res.status(201).json({
      message: "ลงทะเบียนเรียบร้อยแล้ว",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validaion
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array()
      throw error;
    }

    //check Email exist
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("ไม่พบผู้ใช้งาน");
      error.statusCode = 404;
      throw error;
    }
    const isValid = await user.checkPassword(password)
    if (!isValid) {
      const error = new Error("รหัสผ่านไม่ถูกต้อง");
      error.statusCode = 401;
      throw error;
    }

    //creat Token
    const token = await jwt.sign({
      id: user._id,
      role: user.role,
    }, config.KEY, { expiresIn: "5 days" })

    const expires_In = jwt.decode(token)

    res.status(201).json({
      access_token: token,
      expires_In: expires_In.exp,
      token_type: "Bearer"
      // message: "เข้าสู่ระบบสำเร็จ",
    });

  } catch (error) {
    next(error);
  }
};

exports.profile = (req, res, next) => {
  const {role,name,email}=req.user
  res.status(200).json({
    name: name,
    email:email,
    role:role
  })

}