const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const Auth = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .trim()
      .custom((value) => {
        if (!value.endsWith("jaipur.manipal.edu")) {
          throw new Error("You dont have access to this portal!");
        }
        return true;
      })
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 characters long."),
  ],
  authController.postLogin,
);

router.post(
  "/admin/login",
  [
    body("email")
      .trim()
      .custom((value) => {
        if (!value.endsWith("jaipur.manipal.edu")) {
          throw new Error("You dont have access to this portal!");
        }
        return true;
      })
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 characters long."),
  ],
  authController.postAdminLogin,
);

router.post(
  "/change-password",
  Auth,
  [
    body("currentPassword")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 characters long."),
    body("newPassword")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 characters long."),
  ],
  authController.postChangePassword,
);

module.exports = router;
