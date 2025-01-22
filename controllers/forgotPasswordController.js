const sellerModel = require("../models/sellerModel");
module.exports.currentUser = async function (req, res, next) {
    
  await next();
};
