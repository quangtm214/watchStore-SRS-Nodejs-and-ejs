const Brand = require("../model/brandModel");

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
}
module.exports = brandService;
