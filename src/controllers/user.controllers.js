const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const { fullName, email, password, department } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: encryptedPassword,
      department,
    });

    res.status(201).json({
      status: "SUCCESS",
      message: "Account was created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: "Something went wrong with sign up.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "FAILED",
        message: "Email & password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid credentials",
      });

    const doesPwdMatch = await bcrypt.compare(password, user.password);
    if (!doesPwdMatch) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid credentials",
      });
    }

    delete user.password;

    const { _id } = user;
    const expirySecs = 60 * 60; // One hour
    const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
      expiresIn: expirySecs,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: expirySecs * 1000,
    });

    res.status.json({
      status: "SUCCESS",
      message: `Welcome back, ${user.firstName}`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: "Server error",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      status: "SUCCESS",
      message: "Logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: "Server error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req._id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
    }

    res.json({
      status: "SUCCESS",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: "Server error",
    });
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
