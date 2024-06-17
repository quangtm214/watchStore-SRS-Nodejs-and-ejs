const Member = require("../model/memberModel");

class memberService {
  static findMemberById(id) {
    return Member.findById(id);
  }
  static async updateMemberName(id, membername) {
    const existingMember = await Member.findOne({ membername });
    console.log("existingMember", existingMember);
    if (existingMember && String(existingMember._id) !== String(id)) {
      return "Membername already in use";
    }
    const member = Member.findByIdAndUpdate(id, { membername }, { new: true });
    console.log("memberAfterUpdate", member);
    if (member) return member;
  }
}
module.exports = memberService;
