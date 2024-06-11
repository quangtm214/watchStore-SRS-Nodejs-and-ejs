const brandService = require("../service/brandService");
const watchService = require("../service/watchesService");

class watchController {
  static async getListWatch(req, res, next) {
    try {
      const result = await watchService.getListWatch();
      const brands = await brandService.getBrand();
      res.render("watchManage", {
        title: "watches",
        watches: result,
        brands: brands,
      });
    } catch (error) {
      next(error);
    }
  }
  static async createWatch(req, res, next) {
    try {
      const watch = req.body;
      console.log(" req.body: ", req.body);
      if (watch.Automatic == "on") {
        watch.Automatic = true;
      }
      const result = await watchService.createWatch(watch);
      res.redirect("/watchs");
    } catch (error) {
      next(error);
    }
  }
  static async updateWatch(req, res, next) {
    try {
      const watchId = req.params.watchId;
      const watch = req.body;
      if (watch.Automatic == "on") {
        watch.Automatic = true;
      }
      if (!watch.Automatic) {
        watch.Automatic = false;
      }
      console.log(" req.body: ", req.body);
      const result = await watchService.updateWatch(watchId, watch);
      res.redirect("/watchs");
    } catch (error) {
      next(error);
    }
  }
  static async deleteWatch(req, res, next) {
    try {
      const watchId = req.params.watchId;
      const result = await watchService.deleteWatch(watchId);
      res.redirect("/watchs");
    } catch (error) {
      next(error);
    }
  }
  static async getDetailWatch(req, res, next) {
    try {
      const watchId = req.params.watchId;
      const result = await watchService.getDetailWatch(watchId);
      const message = req.session.messageAlreadyComment;
      delete req.session.messageAlreadyComment;
      res.render("watchDetail", {
        title: "watch detail",
        watch: result,
        message: message,
      });
    } catch (error) {
      next(error);
    }
  }
  static async addComments(req, res, next) {
    try {
      const watchId = req.params.watchId;
      let comment = req.body;
      comment = { ...comment, author: req.member._id };
      const result = await watchService.addComments(watchId, comment);
      if (result === "You have already commented on this watch!") {
        req.session.messageAlreadyComment = result;
        return res.redirect(`/watchs/detail/${watchId}`);
      }
      res.redirect(`/watchs/detail/${watchId}`);
    } catch (error) {
      next(error);
    }
  }
  static async editComment(req, res, next) {
    try {
      const watchId = req.params.watchId;
      let comment = req.body;
      comment = { ...comment, author: req.member._id };
      if (comment.author != req.member._id) {
        return res.redirect(`/watchs/detail/${watchId}`);
      }
      const result = await watchService.editComment(watchId, comment);
      res.redirect(`/watchs/detail/${watchId}`);
    } catch (error) {
      next(error);
    }
  }
  static async deleteComment(req, res, next) {
    try {
      const watchId = req.params.watchId;
      const commentId = req.params.commentId;
      console.log("commentId2", commentId);
      const result = await watchService.deleteComment(watchId, commentId);
      res.redirect(`/watchs/detail/${watchId}`);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = watchController;
