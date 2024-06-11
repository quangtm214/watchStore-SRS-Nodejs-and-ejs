var express = require("express");
const homeController = require("../controller/homeController");
var router = express.Router();

/* GET home page. */
router.route("/").get(homeController.gohome);

module.exports = router;
