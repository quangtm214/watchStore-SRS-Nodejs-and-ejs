var express = require("express");
const authController = require("../controller/authController");
const watchController = require("../controller/watchController");

var watchRoute = express.Router();
watchRoute
  .route("/")
  .get(
    authController.protect,
    authController.restricAdmin,
    watchController.getListWatch
  )
  .post(
    authController.protect,
    authController.restricAdmin,
    watchController.createWatch
  );
watchRoute
  .route("/edit/:watchId")
  .post(
    authController.protect,
    authController.restricAdmin,
    watchController.updateWatch
  );
watchRoute
  .route("/delete/:watchId")
  .get(
    authController.protect,
    authController.restricAdmin,
    watchController.deleteWatch
  );
watchRoute.route("/detail/:watchId").get(watchController.getDetailWatch);
watchRoute
  .route("/addComments/:watchId")
  .post(authController.protect, watchController.addComments);
watchRoute
  .route("/editComment/:watchId")
  .post(authController.protect, watchController.editComment);
watchRoute
  .route("/deleteComment/:watchId/:commentId")
  .get(authController.protect, watchController.deleteComment);

module.exports = watchRoute;
