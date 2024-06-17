const brandService = require("../service/brandService");

class brandController {
  static async getBrand(req, res, next) {
    try {
      const result = await brandService.getBrand();
      res.render("brandManage", { title: "brands", brands: result });
    } catch (error) {
      next(error);
    }
  }
  static async createBrand(req, res, next) {
    try {
      const brand = req.body;
      const result = await brandService.createBrand(brand);
      res.redirect("/brands");
    } catch (error) {
      next(error);
    }
  }
  static async updateBrand(req, res, next) {
    try {
      const brandName = req.body.brandName;
      const brandId = req.params.brandId;
      const result = await brandService.updateBrand(brandId, brandName);
      res.redirect("/brands");
    } catch (error) {
      next(error);
    }
  }
  static async deleteBrand(req, res, next) {
    try {
      const brandId = req.params.brandId;
      const result = await brandService.deleteBrand(brandId);
      res.redirect("/brands");
    } catch (error) {
      next(error);
    }
  }
}
module.exports = brandController;
