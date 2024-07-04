const { validationResult } = require("express-validator");
const { Sequelize } = require("sequelize");


const Positions = require("../data/position");
const sequelize = require("../utils/db");


const { Faculty,School,Department } = require("../models/faculty");
const NoteSheet = require("../models/notesheet");
const User = require("../models/user");
const Junction = require("../models/junction");
const Remark = require("../models/remark");
const Chat = require("../models/chat");

/*----------------------------------------Get Routes----------------------------------------*/

exports.getDetails = async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          "notifications",
          "password",
          "createdAt",
          "updatedAt",
          "approveRight",
        ],
      },
    });
    if (user) {
      return res.status(200).json({ user });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["notifications"],
    });
    if (user) {
      return res.status(200).json({
        notifications: user.notifications === null ? [] : user.notifications,
      });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//select t1.status, t1."userId", t1."notesheetId", t4."eventDate", t4.subject, t4.details, t4.proposers from junctions t1 left join (select "notesheetId", max(rank) as lastRank from junctions where status='Approved' group by 1) t2 on t1.rank = t2.lastRank+1 and t1."notesheetId" = t2."notesheetId" join users t3 on t1."userId" = t3.id join notesheets t4 on t1."notesheetId" = t4.id where (t1.rank > 0 or t1.status='Approved' or t1.status='Action Required' or t1.status='Reverted' or t1.status = 'Introduced' or (t1.status = 'Pending' and t2.lastRank is not null)) and t1."userId" = 1

exports.getNotesheetsForApproval = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const q = `select t1.status, t1."userId", t1."notesheetId", t4."eventDate", t4.subject, t4.proposers from junctions t1 join notesheets t4 on t1."notesheetId" = t4.id join users t3 on t1."userId" = t3.id where (((t1.status = 'Pending' or t1.status='Approved' or t1.status='Action Required' or t1.status='Reverted' or t1.status='Rejected') and t1.rank > 0) and t1."userId" = :userId)`;

      const notesheets = await sequelize.query(q, { replacements: { userId } });
      return res.status(200).json({ notesheets: notesheets[0] });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { isActive: true },
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

exports.getApprovers = async (req, res, next) => {
  try {
    const approvers = await User.findAll({
      where: { approveRight: true, isActive: true },
      attributes: [
        "id",
        "name",
        "email",
        "department",
        "faculty",
        "position",
        "isActive",
      ],
    });
    if (approvers) {
      return res.status(200).json({ approvers });
    }
    return res.status(404).json({ message: "No approvers found" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getMyNotesheets = async (req, res, next) => {
  const userId = req.userId;

  try {
    const junctions = await Junction.findAll({
      where: { userId: userId, rank: 0 },
      include: [
        {
          model: NoteSheet,
          as: "notesheet",
          attributes: [
            [Sequelize.col("id"), "notesheetId"],
            "eventDate",
            "subject",
            "details",
            "proposers",
            "status",
            "createdAt",
          ],
        },
      ],
    });

    if (junctions.length > 0) {
      const notesheets = junctions.map((junction) => junction.notesheet);
      return res.status(200).json({ notesheets });
    } else {
      return res.status(404).json({ notesheets: [] });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getFacultyList = async (req, res, next) => {
  try {
    const faculties = await Faculty.findAll();
    if (!faculties) {
      return res.status(404).json({ message: "No faculties found" });
    }
    return res.status(200).json({ faculties });
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getViewerNotesheets = async (req, res, next) => {
  const userId = req.userId;

  try {
    const junctions = await Junction.findAll({
      where: { userId: userId, rank: -1 },
      include: [
        {
          model: NoteSheet,
          as: "notesheet",
          attributes: [
            [Sequelize.col("id"), "notesheetId"],
            "eventDate",
            "subject",
            "details",
            "proposers",
            "status",
            "createdAt",
          ],
        },
      ],
    });

    if (junctions.length > 0) {
      const notesheets = junctions.map((junction) => junction.notesheet);
      return res.status(200).json({ notesheets });
    } else {
      return res.status(404).json({ notesheets: [] });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUserPositions = async (req, res, next) => {
  return res.status(200).json({ Positions });
};

/*----------------------------------------Post Routes----------------------------------------*/

exports.postNewNotesheet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const {
    eventDate,
    days,
    school,
    department,
    subject,
    details,
    objectives,
    proposers,
    faculty,
    finance,
  } = req.body;

  const userId = req.userId;
  const teachers = req.body.teachers;

  try {
    const user = await User.findByPk(userId);
    const existingNotesheet = await NoteSheet.findOne({
      include: [
        {
          model: User,
          through: { model: Junction },
        },
      ],
      where: { subject: subject },
      attributes: ["id", "subject"],
    });

    if (existingNotesheet) {
      throw new Error("Notesheet already exists");
    }

    if (user) {
      const notesheet = await NoteSheet.create({
        eventDate,
        days,
        school,
        department,
        subject,
        details,
        objectives,
        proposers,
        faculty,
        finance,
      });
      teachers.unshift(userId);
      if (notesheet) {
        for (let i = 0; i < teachers.length; i++) {
          const teacher = await User.findByPk(teachers[i]);
          if (teacher) {
            await notesheet.addUser(teacher, { through: { rank: i } });
          }
        }

        const junction = await Junction.findOne({
          where: { userId: userId, notesheetId: notesheet.id },
        });

        if (junction) {
          junction.status = "Approved";
          await junction.save();
          if (notesheet.status === "Reverted") {
            notesheet.status = "Pending";
            await notesheet.save();
          }
        }

        const junctions = await Junction.findAll({
          where: { notesheetId: notesheet.id },
        });

        const allApproved = junctions.every(
          (junction) => junction.status === "Approved" && junction.rank > -1
        );

        if (allApproved) {
          notesheet.status = "Approved";
          notesheet.edit = false;
          await notesheet.save();
        } else {
          const currentUserRank = await Junction.findOne({
            where: { userId: userId, notesheetId: notesheet.id },
            attributes: ["rank", "userId", "notesheetId"],
          });
          const junction2 = await Junction.findOne({
            where: {
              notesheetId: notesheet.id,
              rank: currentUserRank.rank + 1,
            },
          });

          if (junction2) {
            junction2.status = "Pending";
            await junction2.save();
            // transporter.sendMail({
            //   from: "no-reply@nms.com",
            //   to: "aditya.219301222@muj.manipal.edu, sandeep.chaurasia@jaipur.manipal.edu,shikhar.219310188@muj.manipal.edu, chandransh.219301172@muj.manipal.edu, hiya.219301407@muj.manipal.edu, abraham.219301227@muj.manipal.edu",
            //   subject: "New Notesheet",
            //   html: `<h1>Notesheet : "${notesheet.subject}" requires your attention.</h1>`,
            // });
          } else {
            return res
              .status(500)
              .json({ message: "Notesheet creation failed" });
          }
        }

        return res.status(201).json({ message: "Notesheet created" });
      } else {
        return res.status(500).json({ message: "Notesheet creation failed" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postUpdateNotesheet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const {
    notesheetId,
    eventDate,
    days,
    school,
    department,
    subject,
    details,
    objectives,
    proposers,
    faculty,
    finance,
  } = req.body;

  const userId = req.userId;

  const teachers = req.body.teachers;
  try {
    const isNotesheetEditable = await NoteSheet.findByPk(notesheetId);
    //console.log(isNotesheetEditable.dataValues);
    const creator = await Junction.findOne({
      where: { notesheetId: notesheetId, rank: 0 },
    });
    //console.log(creator);
    if (!creator || !isNotesheetEditable) {
      return res.status(404).json({
        message: "User or Notesheet not found",
      });
    }
    if (creator.userId !== userId || !isNotesheetEditable.edit) {
      return res.status(403).json({
        message: "Unauthorized action",
      });
    }
    const notesheet = await NoteSheet.findByPk(notesheetId, {
      include: [
        {
          model: User,
          through: { model: Junction },
        },
      ],
    });
    //console.log(notesheet.dataValues);
    if (notesheet && notesheet.edit) {
      notesheet.eventDate = eventDate || notesheet.eventDate;
      notesheet.days = days || notesheet.days;
      notesheet.school = school || notesheet.school;
      notesheet.department = department || notesheet.department;
      notesheet.subject = subject || notesheet.subject;
      notesheet.details = details || notesheet.details;
      notesheet.objectives = objectives || notesheet.objectives;
      notesheet.proposers = proposers || notesheet.proposers;
      notesheet.faculty = faculty || notesheet.faculty;   //quick check here
      notesheet.finance = finance || notesheet.finance;
      await notesheet.save();

      if (teachers.length > 0) {
        const oldUsers = await notesheet.getUsers();
        await notesheet.removeUsers(oldUsers);
        teachers.unshift(userId);
        for (let i = 0; i < teachers.length; i++) {
          const teacher = await User.findByPk(teachers[i]);
          if (teacher) {
            await notesheet.addUser(teacher, { through: { rank: i } });
          }
        }

        const junction = await Junction.findOne({
          where: { userId: userId, notesheetId: notesheetId },
        });

        if (junction) {
          junction.status = "Approved";
          await junction.save();
        }

        const junctions = await Junction.findAll({
          where: { notesheetId: notesheetId },
        });

        const allApproved = junctions.every(
          (junction) => junction.status === "Approved" && junction.rank > -1
        );

        if (allApproved) {
          notesheet.status = "Approved";
          notesheet.edit = false;
          await notesheet.save();
        } else {
          const currentUserRank = await Junction.findOne({
            where: { userId: userId, notesheetId: notesheetId },
            attributes: ["rank", "userId", "notesheetId"],
          });
          const junction2 = await Junction.findOne({
            where: { notesheetId: notesheetId, rank: currentUserRank.rank + 1 },
          });
          if (junction2) {
            junction2.status = "Pending";
            await junction2.save();
            // transporter.sendMail({
            //   from: "no-reply@nms.com",
            //   to: "aditya.219301222@muj.manipal.edu, shikhar.219310188@muj.manipal.edu, chandransh.219301172@muj.manipal.edu, hiya.219301407@muj.manipal.edu, abraham.219301227@muj.manipal.edu",
            //   subject: "New Notesheet",
            //   html: `<h1>Notesheet : "${notesheet.subject}" requires your attention.</h1>`,
            // });
          } else {
            return res
              .status(500)
              .json({ message: "Notesheet creation failed" });
          }
        }
      }
      notesheet.edit = false;
      await notesheet.save();

      return res.status(200).json({ message: "Notesheet updated" });
    }

    return res.status(404).json({ message: "Student or notesheet not found" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postNotesheetDetails = async (req, res, next) => {
  const { notesheetId } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId, { attributes: ["id", "name"] });

    if (user) {

      const q = `select t1."id" as "notesheetId",t1."eventDate",t1."faculty",t1."school",t1."department",t1."subject",t1."details",t1."objectives",t1."proposers",t1."finance",t1."status",t1."createdAt" as "notesheetCreatedAt",t1."edit",
      t2."rank", t2."status" as "userStatus",t2."updatedAt",
      t3."id" as "approverId",t3."name",t3."email",t3."phone",t3."position",t3."department",
      t4."remark",t4."createdAt" as "remarkCreatedAt" from 
      notesheets t1 join junctions t2 on t1."id" = t2."notesheetId" 
      join users t3 on t2."userId" = t3."id" 
      left join remarks t4 on t4."userId" = t3."id" and t4."notesheetId" = t1."id" where t1."id"=:notesheetId and t2."rank">=0`

      const notesheets = await sequelize.query(q, {
        replacements: { notesheetId },
      });

      const notesheet = notesheets[0];
      if (notesheet) {
        const uniqueUsers = {};
        notesheet.forEach((entry) => {
          if (!uniqueUsers[entry.approverId] && entry.userStatus !== "Viewer") {
            uniqueUsers[entry.approverId] = {
              userId: entry.approverId,
              userName: entry.name,
              userEmail: entry.email,
              userPhone: entry.phone,
              userPosition: entry.position,
              userRank: entry.rank,
              userStatus: entry.userStatus,
              userStatusUpdatedAt: entry.updatedAt,
              userDepartment: entry.department,
            };
          }
        });

        

        const formatedNotesheet = {
          notesheetId: notesheet[0].notesheetId,
          eventDate: notesheet[0].eventDate,
          faculty: notesheet[0].faculty,
          school: notesheet[0].school,
          department: notesheet[0].department,
          subject: notesheet[0].subject,
          details: notesheet[0].details,
          objectives: notesheet[0].objectives,
          proposers: notesheet[0].proposers,
          status: notesheet[0].status,
          createdAt: notesheet[0].notesheetCreatedAt,
          edit: notesheet[0].edit,
          finance: notesheet[0].finance,
          users: Object.values(uniqueUsers),
          remarks: notesheet
            .map((remark) => {
              if (remark && remark.remark != null) {
                return {
                  userId: remark.approverId,
                  userName: remark.name,
                  remark: remark.remark,
                  createdAt: remark.remarkCreatedAt,
                };
              }
            })
            .filter(Boolean),
        };

        return res.status(200).json({ notesheet: formatedNotesheet });
      } else {
        return res.status(404).json({ message: "Notesheet not found" });
      }
    }

    return res.statusCode(404).json({ message: "User not found" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postApproveNotesheet = async (req, res, next) => {
  const { notesheetId } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId);
    const notesheet = await NoteSheet.findByPk(notesheetId, {
      include: [
        {
          model: User,
          through: { model: Junction },
        },
      ],
    });
    if (notesheet.status === "Rejected") {
      return res.status(403).json({ message: "Nigga please!" });
    }
    if (user && notesheet && notesheet.users.length > 0) {
      const junction = await Junction.findOne({
        where: { userId: userId, notesheetId: notesheetId },
      });

      if (junction) {
        junction.status = "Approved";
        await junction.save();
        if (notesheet.status === "Reverted") {
          notesheet.status = "Pending";
          await notesheet.save();
        }
      }

      const junctions = await Junction.findAll({
        where: { notesheetId: notesheetId },
      });

      const allApproved = junctions.every(
        (junction) => junction.status === "Approved" && junction.rank > -1
      );

      if (allApproved) {
        notesheet.status = "Approved";
        notesheet.edit = false;
        await notesheet.save();
      } else {
        const currentUserRank = await Junction.findOne({
          where: { userId: userId, notesheetId: notesheetId },
          attributes: ["rank", "userId", "notesheetId"],
        });

        const junction2 = await Junction.findOne({
          where: { notesheetId: notesheetId, rank: currentUserRank.rank + 1 },
        });

        if (junction2) {
          junction2.status = "Pending";
          await junction2.save();
          // transporter.sendMail({
          //   from: "no-reply@nms.com",
          //   to: "aditya.219301222@muj.manipal.edu, shikhar.219310188@muj.manipal.edu, chandransh.219301172@muj.manipal.edu, hiya.219301407@muj.manipal.edu, abraham.219301227@muj.manipal.edu",
          //   subject: "New Notesheet",
          //   html: `<h1>Notesheet : "${notesheet.subject}" requires your attention.</h1>`,
          // });
        } else {
          return res.status(500).json({ message: "Notesheet creation failed" });
        }
      }

      return res.status(200).json({ message: "Notesheet approved" });
    }

    return res.status(403).json({
      message: "User does not have permission to approve this notesheet",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postNewRemark = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const { notesheetId, remark } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId);
    const notesheet = await NoteSheet.findByPk(notesheetId, {
      attributes: ["subject"],
    });

    if (user && notesheet) {
      await Remark.create({ userId, notesheetId, remark });
      const junction = await Junction.findOne({
        where: { notesheetId: notesheetId, rank: 0 },
        attributes: ["userId", "notesheetId"],
      });
      const creator = await User.findByPk(junction.userId, {
        attributes: ["notifications", "name", "id"],
      });

      if (creator) {
        creator.notifications = [
          ...(creator.notifications || []),
          `New remark added for "${notesheet.subject}" notesheet by ${user.name}`,
        ];
        await creator.save();
        return res.status(200).json({ message: "Remark added" });
      }

      return res.status(404).json({ message: "Creator not found" });
    }

    return res.status(404).json({
      message: "User or notesheet doesn't exist",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postRevertNotesheet = async (req, res, next) => {
  const { notesheetId, toUserId } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId);
    const tillUser = await User.findByPk(toUserId);
    const notesheet = await NoteSheet.findByPk(notesheetId);
    if (user && tillUser && notesheet) {
      const creator = await Junction.findOne({
        where: { notesheetId: notesheetId, rank: 0 },
      });
      if (creator.userId === userId) {
        return res.status(403).json({
          message: "Unauthorized action",
        });
      }
      const userRank = await Junction.findOne({
        where: { userId: userId, notesheetId: notesheetId },
        attributes: ["rank", "userId", "notesheetId"],
      });
      const secondUserRank = await Junction.findOne({
        where: { userId: toUserId, notesheetId: notesheetId },
        attributes: ["rank", "userId", "notesheetId"],
      });
      if (!userRank && !secondUserRank && userRank.rank < secondUserRank.rank) {
        return res.status(403).json({
          message: "User doesnt exist!",
        });
      }

      for (let i = userRank.rank; i > secondUserRank.rank - 1; i--) {
        if (i === secondUserRank.rank) {
          const revertUser = await Junction.findOne({
            where: { rank: i, notesheetId: notesheetId },
          });
          revertUser.status = "Action Required";
          await revertUser.save();
        } else {
          const revertUser = await Junction.findOne({
            where: { rank: i, notesheetId: notesheetId },
          });
          revertUser.status = "Reverted";
          await revertUser.save();
        }
      }
      if (secondUserRank.rank === 0) {
        notesheet.edit = true;
      }
      notesheet.status = "Reverted";
      await notesheet.save();
      return res.status(200).json({ message: "Notesheet reverted" });
    }
    return res.status(404).json({ message: "User or notesheet not found" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postRejectNotesheet = async (req, res, next) => {
  const { notesheetId } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId, { attributes: ["id"] });
    const notesheet = await NoteSheet.findByPk(notesheetId, {
      attributes: ["id", "status"],
    });
    if (user && notesheet) {
      const junction = await Junction.findOne({
        where: { userId: userId, notesheetId: notesheetId },
        attributes: ["status", "userId", "notesheetId"],
      });
      if (junction) {
        junction.status = "Rejected";
        await junction.save();
        notesheet.status = "Rejected";
        await notesheet.save();
        return res.status(200).json({ message: "Notesheet rejected" });
      }
      return res.status(404).json({ message: "Junction not found" });
    }
    return res.status(404).json({ message: "User or notesheet not found" });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteNotesheet = async (req, res, next) => {
  const { notesheetId } = req.body;

  try {
    // const junction = await Junction.findOne({
    //   where: { notesheetId: notesheetId, rank: 0 },
    // });
    // if (junction.userId !== userId) {
    //   return res.status(403).json({
    //     message: "Unauthorized action",
    //   });
    // }
    const notesheet = await NoteSheet.findByPk(notesheetId, {
      include: [
        {
          model: User,
          through: { model: Junction },
        },
      ],
    });

    if (notesheet) {
      await notesheet.destroy();
      return res
        .status(200)
        .json({ message: "Notesheet deleted successfully" });
    }

    return res.status(404).json({ message: "Notesheet not found" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.check = async (req, res, next) => {
  const { notesheetId } = req.body;
  try {
    const notesheet = await NoteSheet.findByPk(notesheetId, {
      include: [
        {
          model: User,
          through: { model: Junction },
        },
      ],
    });
    return res.status(200).json({ notesheet });
  } catch (error) {
    //console.error(error);
  }
};

exports.postSendMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const { receiverId, message, notesheetId } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId, { attributes: ["id", "name"] });
    const receiver = await User.findByPk(receiverId, {
      attributes: ["id", "notifications"],
    });
    const notesheet = await NoteSheet.findByPk(notesheetId, {
      attributes: ["subject"],
    });

    if (user && notesheet && receiver) {
      await Junction.findOrCreate({
        where: {
          userId: receiverId,
          notesheetId: notesheetId,
          rank: -1,
          status: "Viewer",
        },
        defaults: {
          userId: receiverId,
          notesheetId: notesheetId,
          rank: -1,
          status: "Viewer",
        },
      });

      await Chat.create({ userId, notesheetId, receiverId, chat: message });
      receiver.notifications = [
        ...(receiver.notifications || []),
        `New message from ${user.name} for "${notesheet.subject}" notesheet`,
      ];

      return res.status(200).json({ message: "Message Sent" });
    }

    return res.status(404).json({
      message: "User, receiver or notesheet doesn't exist",
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postPrivateRemarks = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const userId = req.userId;
  const notesheetId = req.body.notesheetId;
  try {
    const q = `select distinct t2."chat"as "privateRemark",t2."createdAt" , t3."name" as "senderName", t4."name" as "receiverName" from junctions t1 join chats t2 on (t2."userId" = t1."userId" and t2."notesheetId" = t1."notesheetId") join users t3 on t2."userId" = t3."id" join users t4 on t2."receiverId" = t4."id" where t2."notesheetId"=:notesheetId and t2."userId"=:userId or t2."receiverId"= :userId`;

    const privateRemarks = await sequelize.query(q, {
      replacements: { userId, notesheetId },
    });
    return res.status(200).json({ privateRemarks: privateRemarks[0] || [] });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postUserMail = (req,res, next) => {
  to = req.body.to;
  name = req.body.name;
 sendMail(to,name);
  next();
};