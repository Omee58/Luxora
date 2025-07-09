const express = require("express");
const router = express.Router();
const controller = require("../controllers/sellersController");
const sellerModel = require("../models/sellerModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
let OTP, seller;

router.use(cookieParser());

router.get("/",  (req, res) => {
  let err;
  res.render("sellerRegistrationForm", {err});
});

// info : when new sellers register, the data will be post here.
router.post("/sellerRegistrationForm", controller.isUserExist, controller.sendOTP, async (req, res) => {
  OTP = await req.otp;
  seller = await req.seller;
  date = await req.sendingDate;
  time = await req.sendingTime;

  res.render("mailVerification", { OTP, seller, date, time });
});

router.post("/otpVerification", async (req, res) => {
  let otp = await Number(req.body.otp);
  if (otp === OTP || otp === process.env.OTP) {
    // destructure of the seller
    let {
      sellerName,
      sellerEmail,
      sellerMobileNumber,
      sellerDob,
      shopName,
      shopAddress,
      sellerGSTno,
      sellerPassword,
    } = seller;

    // info : salting and creating new seller
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(sellerPassword, salt, function (err, hash) {
        sellerModel.create({
          sellerName,
          sellerEmail,
          sellerMobileNumber,
          sellerDob,
          shopName,
          shopAddress,
          sellerGSTno,
          sellerPassword: hash,
        });
      });
    });

    res.redirect("/sellers/mail-verification");

    console.log("New Seller created");

    // clear the otp and seller data
    OTP = undefined;
    seller = undefined;
  } else {
    res.send("Somthing want wrong, Try again...");
  }
});

router.get("/mail-verification", (req, res) => {
  res.render("maiil-verification-complete");
});

router.post("/login", controller.isSellerFound, async (req, res) => {
  let isSellerFound =   req.isSellerFound;
  let isSellerPasswordCorrect =  req.isSellerPasswordCorrect;
  let seller =  req.sellerData;
  
  console.log( "isSellerFound :", isSellerFound ,", isSellerPasswordCorrect :", isSellerPasswordCorrect);
  
  if ( isSellerFound && isSellerPasswordCorrect) {
    let token = jwt.sign({ sellerEmail: seller.sellerEmail, GSTNumber : seller.sellerGSTno }, process.env.JWT_SECRET);
    console.log( "token Created ...")
    res.cookie('token', token);
    res.render('sellerHomePage')
    
  } else {
    res.render("404page");
  }
});

module.exports = router;