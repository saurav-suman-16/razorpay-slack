const model = require('./model');

exports.findOneAndUpdate = async (filter, data) => {
  console.log("filter, data", filter, data)
  return model.findOneAndUpdate(filter, data, { upsert: true, new: true });
};

exports.findOne = async (condition) => {
  return model.findOne(condition);
};
