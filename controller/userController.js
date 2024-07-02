const express = require("express");
const app = express();

const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;
    const isExistUser = await User.findOne({ email  });
    if (isExistUser) {
      return res.status(403).json({
        success: false,
        massage: "User Already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      roles,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const UserData = await User.findOne({ email  });
    if (!UserData) {
      return res.status(400).json({
        success: false,
        massage: "Email or Password is Incorrect",
      });
    }
    const passwordMatch = await bcrypt.compare(password, UserData.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Email or Password is Incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: UserData.id,
        email: UserData.email,
        role: UserData.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    return res.status(200).json({
      success: true,
      message: "User Loggedin successfully",
      data: UserData,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const id = req.params.id;

    // Check if the User exists
    const existingUser = await User.findOne({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Hash the password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the User with provided fields
    const updatedUser = await User.update(
      { name, email, password: hashedPassword },
      { where: { id } }
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser[1],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const isExistUser = await User.findOne({ where: { id } });

    if (!isExistUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }
    const deleteUser = await User.destroy({ where: { id } });
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: isExistUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
  
    const pageNumber = parseInt(req.query.page, 10);
    const limitNumber = parseInt(req.query.limit, 10);

    const { count,rows } = await User.findAndCountAll({
      offset:(pageNumber - 1) * limitNumber,
      limit:limitNumber
    })
  
    return res.status(200).json({
      totalUsers: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      users: rows,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};