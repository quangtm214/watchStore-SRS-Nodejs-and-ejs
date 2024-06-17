const memberService = require("../service/memberService");

class memberController {
  async updateMember(req, res) {
    let membername = req.body.membername;
    let memberID = req.member.id;
    let member = await memberService.updateMemberName(memberID, membername);
    console.log(member);
    if (member === "Membername already in use") {
      res.status(400);
      return res.redirect("/auth/personal?message=Membername already in use");
    }
    res.redirect("/auth/personal");
  }
}
module.exports = new memberController();
