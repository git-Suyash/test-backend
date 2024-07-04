const express = require("express");
const { body } = require("express-validator");

const Auth = require("../middlewares/auth");
const userController = require("../controllers/user");

const router = express.Router();

/*----------------------------------------Get Routes----------------------------------------*/

router.get("/user-details", Auth, userController.getDetails);

router.get("/user-notifications", Auth, userController.getNotifications);

router.get(
  "/notesheets-for-approval",
  Auth,
  userController.getNotesheetsForApproval,
);

router.get("/users", userController.getAllUsers);

router.get("/approvers", userController.getApprovers);

router.get("/my-notesheets", Auth, userController.getMyNotesheets);

router.get("/faculty-list", userController.getFacultyList);

router.get("/viewer-notesheets", Auth, userController.getViewerNotesheets);

router.get("/position-list", userController.getUserPositions);

/*----------------------------------------Post Routes----------------------------------------*/

router.post(
  "/new-notesheet",
  Auth,
  [
    body("eventDate")
      .isDate()
      .not()
      .isEmpty()
      .withMessage("Event Date cannot be empty")
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error("Invalid Event Date");
        }
        return true;
      }),

    body("days")
      .trim()
      .isNumeric()
      .not()
      .isEmpty()
      .withMessage("Days cannot be empty."),

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

    body("subject")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Subject cannot be empty."),

    body("faculty")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Faculty cannot be empty."),

    body("details")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Details cannot be empty."),

    body("objectives")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Objectives cannot be empty."),

    body("proposers")
      .isArray()
      .not()
      .isEmpty()
      .withMessage("Proposers must be an array.")
      .custom((value) => {
        if (value.length < 1) {
          throw new Error("At least one proposer is required");
        }
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] !== "string") {
            throw new Error("All proposers must be strings");
          }
        }
        return true;
      }),

    body("teachers")
      .isArray()
      .not()
      .isEmpty()
      .withMessage("Approvers must be an array.")
      .custom((value) => {
        if (value.length < 1) {
          throw new Error("At least one approver is required");
        }
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] !== "number") {
            throw new Error("All approvers must be number");
          }
        }
        return true;
      }),
  ],
  userController.postNewNotesheet,
);

router.post(
  "/update-notesheet",
  Auth,
  [
    body("eventDate")
      .isDate()
      .not()
      .isEmpty()
      .withMessage("Event Date cannot be empty")
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error("Invalid Event Date");
        }
        return true;
      }),

    body("days")
      .trim()
      .isNumeric()
      .not()
      .isEmpty()
      .withMessage("Days cannot be empty."),

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

    body("subject")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Subject cannot be empty."),

    body("faculty")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Faculty cannot be empty."),

    body("details")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Details cannot be empty."),

    body("objectives")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Objectives cannot be empty."),

    body("proposers")
      .isArray()
      .not()
      .isEmpty()
      .withMessage("Proposers must be an array.")
      .custom((value) => {
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] !== "string") {
            throw new Error("All proposers must be strings");
          }
        }
        return true;
      }),

    body("teachers")
      .isArray()
      .not()
      .isEmpty()
      .withMessage("Teachers must be an array."),
  ],
  userController.postUpdateNotesheet,
);

router.post("/notesheet-details", Auth, userController.postNotesheetDetails);

router.post("/approve-notesheet", Auth, userController.postApproveNotesheet);

router.post(
  "/new-remark",
  Auth,
  [
    body("remark")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Remark cannot be empty."),
  ],
  userController.postNewRemark,
);

router.post("/revert-notesheet", Auth, userController.postRevertNotesheet);

router.post("/reject-notesheet", Auth, userController.postRejectNotesheet);

router.post(
  "/send-message",
  Auth,
  [
    body("receiverId")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Receiver ID cannot be empty."),
    body("message")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Message cannot be empty."),
  ],
  userController.postSendMessage,
);

router.post("/private-remarks", Auth, userController.postPrivateRemarks);

router.post("/delete", userController.deleteNotesheet);

router.post("/check", userController.check);

module.exports = router;




