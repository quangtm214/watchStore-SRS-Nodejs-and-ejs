const Member = require("../model/memberModel");

class memberSerrvice {
  static findMemberById(id) {
    return Member.findById(id);
  }
}
module.exports = memberSerrvice;
