const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const Auth = require("../middlewares/auth");

const router = express.Router();

/*----------------------------------------Get Routes----------------------------------------*/

router.get("/all-notesheets", Auth, adminController.getAllNotesheets);
router.get("/admin/users", adminController.getAllUsers);

/*----------------------------------------Post Routes----------------------------------------*/

router.post(
  "/add-new-user",
  Auth,
  [
    body("email")
      .trim()
      .custom((value) => {
        if (!value.endsWith("jaipur.manipal.edu")) {
          throw new Error("Only official emails have access to this portal!");
        }
        return true;
      })
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email"),

    body("name").trim().not().isEmpty().withMessage("Name cannot be empty."),

    body("position")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Position cannot be empty."),

    body("school")
      .trim()
      .not()
      .isEmpty()
      .withMessage("School cannot be empty."),

    body("department")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Department cannot be empty."),

    body("faculty")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Faculty cannot be empty."),

    body("phone")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be of 10 digits"),
  ],
  adminController.postAddNewUser,
);

router.post(
  "/update-user",
  Auth,
  [
    body("email")
      .trim()
      .custom((value) => {
        if (!value.endsWith("jaipur.manipal.edu")) {
          throw new Error("Only official emails have access to this portal!");
        }
        return true;
      })
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email"),

    body("name").trim().not().isEmpty().withMessage("Name cannot be empty."),

    body("position")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Position cannot be empty."),

    body("school")
      .trim()
      .not()
      .isEmpty()
      .withMessage("School cannot be empty."),

    body("department")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Department cannot be empty."),

    body("faculty")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Faculty cannot be empty."),

    body("phone")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be of 10 digits"),
  ],
  adminController.postUpdateUser,
);

router.post(
  "/activate-user",
  Auth,
  [
    body("userId")
      .trim()
      .not()
      .isEmpty()
      .withMessage("User Id cannot be empty."),
    body("active")
      .trim()
      .isBoolean()
      .not()
      .isEmpty()
      .withMessage("Active field cannot be empty."),
  ],
  adminController.postActivateUser,
);

// router.post("/send-mail", adminController.postUserMail);

module.exports = router;
