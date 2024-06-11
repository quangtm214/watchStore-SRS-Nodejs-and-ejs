var express = require("express");
const authController = require("../controller/authController");

var authRoute = express.Router();
authRoute
  .route("/signup")
  .get(authController.goSignup)
  .post(authController.signup);
authRoute
  .route("/login")
  .get(authController.goLogin)
  .post(authController.login);
authRoute.route("/logout").get(authController.logout);
authRoute
  .route("/personal")
  .get(authController.protect, authController.personal);
authRoute
  .route("/personal/changePassword")
  .post(authController.protect, authController.ChangePassword);
module.exports = authRoute;
