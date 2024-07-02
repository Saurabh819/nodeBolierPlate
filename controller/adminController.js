const express = require("express");
const app = express();

const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { name,email, password,role } = req.body;
    const isExistUser = await Admin.findOne({ email });
    if (isExistUser) {
      return res.status(403).json({
        success: false,
        massage: "admin already exists",
      });
    }
    const isValidRoles = role.every(role => ["user", "admin"].includes(role)) && role.includes("admin");
    if (!isValidRoles) {
      return res.status(400).json({
        success: false,
        message: "Invalid roles. Admin must have the 'admin' role and can optionally have the 'user' role.",
        data: null,
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Admin.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "admin Registered Successfully",
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

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await Admin.findOne({ email  });
    if (!userData) {
      return res.status(400).json({
        success: false,
        massage: "Email or Password is Incorrect",
      });
    }
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Email or Password is Incorrect",
      });
    }

    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin Loggedin successfully",
      data: userData,
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

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const id = req.params.id;

    // Check if the user exists
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

    // Update the user with provided fields
    const updatedUser = await User.update(
      { username, email, password: hashedPassword },
      { where: { id } }
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const deleteUser = async (req, res) => {
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