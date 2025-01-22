const express = require("express");
const router = express.Router();
// const sellersRoute = require('./sellersRoute');
const sellerModel = require("../models/sellerModel");
const controller = require("../controllers/sellersController");
const forgotController = require("../controllers/forgotPasswordController");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

let forgotEmail;

router.get("/", (req, res) => {
  forgotEmail = req.query.email;
  res.render("forgetPassword");
});

router.post(
  "/forgotPassword-OTPVerification",
  controller.forgotPassword,
  async (req, res) => {
    const OTP = await req.OTP;
    const seller = await req.seller;
    const date = await req.sendingDate;
    const time = await req.sendingTime;

    res.render("forgotPasswordOtpVerification", { OTP, seller, date, time });
  }
);

router.post("/newPassword", (req, res) => {
  res.render("newPassword");
});

router.post("/updatePassword", async (req, res) => {

  bcrypt.genSalt(12, function (err, salt) {
    bcrypt.hash(req.body.ConfirmPassword, salt, async function (err, hash) {
      let newuser = await sellerModel.findOneAndUpdate(
        { sellerMail: forgotEmail },
        { sellerPassword: hash }
      );
      console.log("Seller's Password Updated :", req.body.ConfirmPassword);
      sendUpdatePasswordMail(newuser)
    });
  });
});

function sendUpdatePasswordMail(seller) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: seller.sellerEmail,
    subject: "Your Password Has Been Successfully Updated - LUXORA",
    html: `
       <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f6f9; padding: 40px 0;">
    <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://ci3.googleusercontent.com/meips/ADKq_NZZDRTggP4F6AwNeAN3xP969oOvlkmPR5F1MnMnmsTYNLp78A02Eocmo75IQi2V4Ey_sBxC5USIWHV8EZDgr1FXcmiDjibe3kC1VNKFhlyNZPXMYum_bvO_DwCda38Mwc5vaR01nSNAHpinzjv1PHTQXw=s0-d-e1-ft#https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpkCzhV3epNzEEqM3n3pSaHFXV-v6rQ5BK1Q&s" alt="Luxora" style="max-width: 150px; color: red;">
        </div>

        <!-- Greeting -->
        <h1 style="font-size: 24px; color: #1d72b8; text-align: center; margin-bottom: 20px;">Hello ${
          seller.sellerName
        },</h1>

        <!-- Update Notification -->
        <p style="font-size: 16px; line-height: 1.6; color: #555;">We wanted to let you know that your password has been successfully updated for your Luxora account.</p>

        <!-- Instructions -->
        <p style="font-size: 16px; line-height: 1.6; color: #555;">If you did not make this change, please contact our support team immediately to secure your account.</p>

        <p style="font-size: 16px; line-height: 1.6; color: #555;">If you have any questions or need further assistance, feel free to reach out to us.</p>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; font-size: 14px; color: #888;">
            <p>Best regards,</p>
            <p style="font-weight: bold; color: #1d72b8;">The Luxora Team</p>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
            <p>&copy; ${new Date().getFullYear()} Luxora. All rights reserved.</p>
            <p style="font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
    </div>
</div>
  
      `,
  };

  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send("Error sending OTP email.");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = router;
