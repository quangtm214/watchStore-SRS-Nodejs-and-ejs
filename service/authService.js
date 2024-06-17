const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Member = require("../model/memberModel");
const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

class authService {
  static signup = async (member) => {
    const existingMember = await Member.findOne({ membername: member.name });
    if (existingMember) {
      return "Member already exists";
    }
    member.password = await bcryptjs.hash(member.password, 10);
    const newMember = new Member(member);
    return await newMember.save();
  };

  static login = async (member) => {
    const existingMember = await Member.findOne({
      membername: member.membername,
    });
    console.log("existingMember", existingMember);
    if (!existingMember) {
      return "Member not found";
    }
    const truePassword = await bcryptjs.compare(
      member.password,
      existingMember.password
    );
    console.log("truePassword", truePassword);
    if (!truePassword) return "Password is not correct";

    const token = await jwt.sign(
      { id: existingMember._id, isAdmin: existingMember.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    existingMember.password = undefined;
    return { token, existingMember };
  };

  static async protect(token) {
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await Member.findOne({ _id: decoded.id });
    if (!currentUser) {
      return null;
    }
    const ifChangePass = await this.changePasswordAfter(
      decoded.iat,
      currentUser._id
    );
    console.log("ifChangePass", ifChangePass);
    if (ifChangePass) {
      return null;
    }
    return currentUser;
  }

  static async getMemberById(memberID) {
    return await Member.findOne({ _id: memberID });
  }
  static async ChangePassword(member) {
    const existingMember = await Member.findOne({
      _id: member.id,
    });
    if (!existingMember) {
      return "Member not found";
    }

    const truePassword = await bcryptjs.compare(
      member.oldPassword,
      existingMember.password
    );
    console.log("truePassword", truePassword);
    if (!truePassword) {
      return "Old password is incorrect";
    }

    const newPasswordHash = await bcryptjs.hash(member.newPassword, 10);
    const passwordChangeAt = Date.now() - 1000;

    const memberChange = await Member.findByIdAndUpdate(
      existingMember._id,
      { password: newPasswordHash, passwordChangeAt },
      { new: true }
    );

    if (!memberChange) {
      return "Failed to change password";
    }

    const token = jwt.sign(
      { id: memberChange._id, isAdmin: memberChange.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    existingMember.password = undefined;
    return { token, memberChange };
  }
  static async changePasswordAfter(JWTTimestamp, memberId) {
    const member = await Member.findById({ _id: memberId });
    if (member) {
      if (member.passwordChangeAt) {
        const changedTimestamp = Math.floor(
          member.passwordChangeAt.getTime() / 1000
        );
        return JWTTimestamp < changedTimestamp;
      }
    }
    return false;
  }
}
module.exports = authService;
