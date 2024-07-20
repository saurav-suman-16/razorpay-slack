const model = require("./model");

exports.findOneAndUpdate = async (filter, data) => {
  return model.findOneAndUpdate(filter, data, { upsert: true, new: true }).lean();
};

exports.findOne = async (condition) => {
  return model.findOne(condition).lean();
};
