require("dotenv").config({ path: "./.env.production" });

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

// const { sendMail } = require("../mail");
const User = require("../models/user");
const NoteSheet = require("../models/notesheet");

/*----------------------------------------Get Routes----------------------------------------*/

exports.getAllNotesheets = async (req, res, next) => {
  const userId = req.userId;
  try {
    const isSuperUser = await User.findOne({
      where: { id: userId, superUser: true },
    });

    if (!isSuperUser) {
      return res.status(401).json({
        message: "LOL 😂, you are not authorized to perform this action",
      });
    }

    const notesheets = await NoteSheet.findAll();

    return res.status(200).json({ notesheets: notesheets });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "school",
        "department",
        "faculty",
        "position",
        "phone",
        "isActive",
        "approveRight"
      ],
    });

    return res.status(200).json({ users });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

/*----------------------------------------Post Routes----------------------------------------*/

exports.postAddNewUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const {
    email,
    name,
    position,
    school,
    department,
    phone,
    faculty,
    approveRight,
  } = req.body;
  const userId = req.userId;
  try {
    const isSuperUser = await User.findOne({
      where: { id: userId, superUser: true },
    });

    if (!isSuperUser) {
      return res.status(401).json({
        message: "Unauthorized Action",
      });
    }

    const password = "muj@123";
    const hashedPassword = await bcrypt.hash(password, 12);

    const [user, created] = await User.findOrCreate({
      where: { [Op.or]: [{ email: email.toLowerCase() }, { phone: phone }] },
      defaults: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name,
        position: position,
        school: school,
        department: department,
        phone: phone,
        faculty: faculty,
        approveRight: approveRight,
      },
    });

    if (!created) {
      const error = new Error("User already exists!");
      error.statusCode = 401;
      throw error;
    }
    //TODO: Remove password before deployment
    return res
      .status(200)
      .json({ message: "User created successfully!", password: password });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUpdateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const {
    userId,
    email,
    name,
    position,
    school,
    department,
    phone,
    faculty,
    approveRight,
  } = req.body;
  const superUser = req.userId;
  try {
    const isSuperUser = await User.findOne({
      where: { id: superUser, superUser: true },
    });

    if (!isSuperUser) {
      return res.status(401).json({
        message: "Unauthorized Action",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.email = email.toLowerCase() || user.email;
    user.name = name || user.name;
    user.position = position || user.position;
    user.school = school || user.school;
    user.department = department || user.department;
    user.phone = phone || user.phone;
    user.faculty = faculty || user.faculty;
    user.approveRight = approveRight || user.approveRight;
    await user.save();

    return res.status(200).json({ message: "User updated successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postActivateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const { userId, active } = req.body;
  const superUser = req.userId;

  try {
    const isSuperUser = await User.findOne({
      where: { id: superUser, superUser: true },
    });

    if (!isSuperUser) {
      return res.status(401).json({
        message: "Unauthorized Action",
      });
    }

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "isActive"],
    });

    if (user) {
      user.isActive = active;
      await user.save();
      return res.status(200).json({
        message: `${user.name} ${user.isActive ? `Activated` : "Deactivated"}`,
      });
    }
    return res.status(404).json({ message: "User not found!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// exports.postUserMail = (req,res, next) => {
//   to = req.body.to;
//   name = req.body.name;
//  sendMail(to,name);
//   next();
// };
