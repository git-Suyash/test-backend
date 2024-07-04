const express = require("express");
const { body } = require("express-validator");

const insightsController = require("../controllers/insights");
const Auth = require("../middlewares/auth");

const router = express.Router();

/*----------------------------------------Get Routes----------------------------------------*/

router.get("/stats", Auth, insightsController.getStats);

module.exports = router;
