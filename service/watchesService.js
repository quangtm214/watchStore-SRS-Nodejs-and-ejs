const Watch = require("../model/watchModel");
const apiFeature = require("../utils/apiFeature");

class watchService {
  static async getListWatch(reqQuery) {
    const features = new apiFeature(
      Watch.find().populate("brand", "brandName"),
      reqQuery
    )
      .parseQuery()
      .parseSort()
      .parseFields()
      .parsePage();
    const watchList = await features.query;
    return watchList;
  }
  static async getDetailWatch(watchId) {
    return await Watch.findById(watchId)
      .populate("brand", "brandName")
      .populate({
        path: "comments.author",
        select: "membername",
      });
  }
  static async createWatch(watch) {
    return await Watch.create(watch);
  }
  static async updateWatch(watchId, watch) {
    return await Watch.findByIdAndUpdate(watchId, watch, { new: true });
  }
  static async deleteWatch(watchId) {
    return await Watch.findByIdAndDelete(watchId);
  }
  static async addComments(watchId, comment) {
    const existingComment = await Watch.findOne({
      _id: watchId,
      comments: { $elemMatch: { author: comment.author } },
    });
    if (existingComment) {
      return "You have already commented on this watch!";
    }
    const watch = await Watch.findById(watchId);
    console.log("comment", comment);
    watch.comments.push(comment);
    return await watch.save();
  }
  static async editComment(watchId, comment) {
    const watch = await Watch.findById(watchId);
    const index = watch.comments.findIndex((cmt) => cmt._id == comment._id);
    watch.comments[index] = comment;
    return await watch.save();
  }
  static async deleteComment(watchId, commentId) {
    console.log("commentId", commentId);
    const watch = await Watch.findById(watchId);
    watch.comments = watch.comments.filter((cmt) => cmt._id != commentId);
    return await watch.save();
  }
}
module.exports = watchService;
