const { token } = require("morgan");
const authService = require("../service/authService");
const passport = require("passport");

class authController {
  async goSignup(req, res) {
    res.render("signup", {
      title: "signup",
      message: "",
    });
  }
  async goLogin(req, res) {
    res.render("login", {
      title: "login",
      message: "",
    });
  }
  async signup(req, res, next) {
    try {
      const member = req.body;
      const result = await authService.signup(member);
      if (result === "Member already exists") {
        return res.render("signup", {
          title: "signup",
          message: "Member already exists",
        });
      }
      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    // passport.authenticate("local", {
    //   successRedirect: "/",
    //   failureRedirect: "auth/login",
    //   failureFlash: true,
    // })(req, res, next);
    try {
      const member = req.body;
      const result = await authService.login(member);
      if (
        result === "Member not found" ||
        result === "Password is not correct"
      ) {
        return res.render("login", {
          title: "login",
          message: result,
        });
      }
      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.cookie("jwt", result.token, cookieOptions);
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
  async protect(req, res, next) {
    // if (req.isAuthenticated()) {
    //   return next();
    // }
    // req.flash("error", "Please log in first!");
    // res.redirect("/auth/login");
    const token = req.cookies.jwt;
    if (!token) {
      return res.redirect("/auth/login");
    }
    const result = await authService.protect(token);
    if (result === null) {
      return res.redirect("/auth/login");
    }
    req.member = result;
    next();
  }
  async restricAdmin(req, res, next) {
    if (req.member.isAdmin === false) {
      return res.render("forbidden", {
        title: "403",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  }
  async logout(req, res, next) {
    // req.logout(function (err) {
    //   if (err) {
    //     return next(err);
    //   }
    //   req.flash("success_msg", "You are logged out");
    //   res.redirect("/auth/login");
    // });

    res.cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
    });
    req.session.destroy((err) => {
      if (err) {
        console.log(
          "Error : Failed to destroy the session during logout.",
          err
        );
      }
    });
    res.redirect("/");
  }
  async personal(req, res) {
    const message = req.query.message;
    console.log("message", message);
    const member = await authService.getMemberById(req.member._id);
    res.render("personal", {
      title: "personal",
      member: member,
      message: message,
    });
  }

  async ChangePassword(req, res, next) {
    let member = req.body;
    member = { ...member, id: req.member.id };
    const result = await authService.ChangePassword(member);
    console.log("result", result);
    if (result === "Old password is incorrect") {
      res.status(400);
      return res.redirect("/auth/personal?message=Old password is incorrect");
    }
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("jwt", result.token, cookieOptions);
    res.redirect("/auth/personal");
  }
}
module.exports = new authController();
