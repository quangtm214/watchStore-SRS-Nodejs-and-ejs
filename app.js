var createError = require("http-errors");
var express = require("express");
var app = express();

var path = require("path");
var cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
require("./passport")(passport);

const jwt = require("jsonwebtoken");
const memberSerrvice = require("./service/memberService");
var logger = require("morgan");
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/WatchShop";
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("connect success");
});
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authRoute = require("./routes/authRoute");
const brandRoute = require("./routes/brandRoute");
const watchRoute = require("./routes/watchRoute");
const authController = require("./controller/authController");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Đặt secure thành false trong môi trường phát triển
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  //   try {
  //     const memberId = req.session.memberId;
  //     if (memberId) {
  //       const member = await memberSerrvice.findMemberById(memberId);
  //       if (member) {
  //         res.locals.member = member.toObject(); // Sử dụng toObject() nếu là Mongoose document
  //       } else {
  //         console.log("Member not found");
  //         res.locals.member = null;
  //       }
  //     } else {
  //       res.locals.member = null;
  //     }
  //   } catch (error) {
  //     console.error("Error in auth middleware:", error);
  //     res.locals.member = null;
  //   }
  //   next();
  // });
  try {
    const token = req.cookies.jwt;
    if (token) {
      console.log("token", token);
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);
      if (decoded && decoded.id) {
        const memberId = decoded.id;
        console.log("memberId", memberId);
        const member = await memberSerrvice.findMemberById(memberId);
        console.log("member", member);
        if (member) {
          console.log("member", member);
          res.locals.member = member.toObject(); // Sử dụng toObject() nếu là Mongoose document
        } else {
          console.log("Member not found");
          res.locals.member = null;
        }
      } else {
        res.locals.member = null;
      }
    } else {
      res.locals.member = null;
    }
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.locals.member = null;
  }
  next();
});
// app.use(authController.checkJWT);
app.use("/", indexRouter);
app.use("/member", usersRouter);
app.use("/auth", authRoute);
app.use("/brands", brandRoute);
app.use("/watchs", watchRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
