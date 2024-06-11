const brandService = require("../service/brandService");
const watchService = require("../service/watchesService");

class homeController {
  static async gohome(req, res) {
    const filteredQuery = Object.fromEntries(
      Object.entries(req.query).filter(
        ([key, value]) => value !== "" && value !== undefined
      )
    );
    req.session.watchName = filteredQuery.watchName;
    req.session.brand = filteredQuery.brand;
    const result = await watchService.getListWatch(filteredQuery);
    const brands = await brandService.getBrand();
    res.render("home", {
      title: "home",
      watches: result,
      brands: brands,
      session: req.session,
    });
  }
}
module.exports = homeController;
