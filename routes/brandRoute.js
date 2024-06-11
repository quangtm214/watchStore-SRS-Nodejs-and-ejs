var express = require("express");
const brandController = require("../controller/brandController");
const authController = require("../controller/authController");

var brandRoute = express.Router();
brandRoute
  .route("/")
  .get(
    authController.protect,
    authController.restricAdmin,
    brandController.getBrand
  )
  .post(
    authController.protect,
    authController.restricAdmin,
    brandController.createBrand
  );

brandRoute
  .route("/edit/:brandId")
  .post(
    authController.protect,
    authController.restricAdmin,
    brandController.updateBrand
  );

module.exports = brandRoute;
