const Brand = require("../model/brandModel");
const Watch = require("../model/watchModel");
const watchService = require("./watchesService");

class brandService {
  static getBrand() {
    return Brand.find();
  }
  static createBrand(brand) {
    const newBrand = new Brand(brand);
    return newBrand.save();
  }
  static updateBrand(brandId, brandName) {
    return Brand.findByIdAndUpdate(
      brandId,
      { brandName: brandName },
      { new: true }
    );
  }
  static async deleteBrand(brandId) {
    await Watch.deleteMany({ brand: brandId });
    return Brand.findByIdAndDelete(brandId);
  }
}
module.exports = brandService;
