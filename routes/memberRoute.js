var express = require("express");
const memberController = require("../controller/memberController");
const authController = require("../controller/authController");
var memberRoute = express.Router();
memberRoute
  .route("/updateMemberName")
  .post(authController.protect, memberController.updateMember);
module.exports = memberRoute;
