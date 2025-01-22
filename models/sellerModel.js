const mongoose = require("../config/mongo");

const userSchema = new mongoose.Schema({
  sellerName: String,
  sellerEmail: String,
  sellerMobileNumber: Number,
  sellerDob: Date,
  shopName: String,
  shopAddress: String,
  sellerGSTno: String,
  sellerPassword: String,
  sellerCreationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Seller", userSchema);