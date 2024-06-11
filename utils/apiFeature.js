class apiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  parseQuery() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    this.queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(this.queryStr));
    return this;
  }
  parseFields() {
    if (!this.queryStr.fields) {
      console.log("fields", this.queryStr.fields);
      const fields = this.queryStr.fields;
      const field = fields ? fields.split(",").join(" ") : null;
      this.query = this.query.select(field);
      return this;
    }
    return this;
  }

  parseSort() {
    const sort = this.queryStr.sort;
    sort ? sort.split(",").join(" ") : "name";
    this.query = this.query.sort(sort);
    return this;
  }
  parsePage() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = apiFeature;
