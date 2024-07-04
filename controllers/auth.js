//require("dotenv").config({ path: "../.env.developement" });
require("dotenv").config({ path: "./.env.production" });

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.postLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      attributes: ["id", "password", "email", "approveRight", "position"],
    });
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.JWT_TOKEN,
      { expiresIn: "12h" },
    );

    return res.status(200).json({
      token: token,
      approveRight: user.approveRight === null ? false : user.approveRight,
      userId: user.id,
      insightsView: !!(
        user.position === "Deputy Head of Department" ||
        user.position === "Head of Department" ||
        user.position === "Director" ||
        user.position === "Dean" ||
        user.position === "Registrar" ||
        user.position === "Pro President" ||
        user.position === "President"
      ),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postChangePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const user = await User.findByPk(userId, { attributes: ["password", "id"] });
  if (user) {
    const isPasswordEqual = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (isPasswordEqual) {
      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      return res
        .status(200)
        .json({ message: "Password changed successfully!" });
    }
    return res.status(401).json({ message: "Wrong password!" });
  }
  return res.status(404).json({ message: "User not found!" });
};

exports.postAdminLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      attributes: ["id", "password", "email", "superUser"],
    });
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 401;
      throw error;
    }
    if (!user.superUser) {
      const error = new Error("You are not authorized to perform this action!");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.JWT_TOKEN,
      { expiresIn: "12h" },
    );

    return res.status(200).json({
      token: token,
      userId: user.id,
      admin: user.superUser,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
