const nodemailer = require("nodemailer");
module.exports.sendOTP = async function (req, res, next) {
  let { sellerEmail, sellerName } = await req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "luxora.team.2025@gmail.com",
      pass: "nxbv meef dtae ierz",
    },
  });

  // Function to generate a random OTP
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  const otp = generateOTP();
// info : sending below data with middelware
  req.seller = req.body;
  req.otp = otp;
  req.sendingDate = getTime().currentDate;
  req.sendingTime = getTime().currentTime;

 

  const mailOptions = {
    to: sellerEmail,
    subject: "Seller Registration OTP - Luxora",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f6f9; padding: 40px 0;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://ci3.googleusercontent.com/meips/ADKq_NZZDRTggP4F6AwNeAN3xP969oOvlkmPR5F1MnMnmsTYNLp78A02Eocmo75IQi2V4Ey_sBxC5USIWHV8EZDgr1FXcmiDjibe3kC1VNKFhlyNZPXMYum_bvO_DwCda38Mwc5vaR01nSNAHpinzjv1PHTQXw=s0-d-e1-ft#https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpkCzhV3epNzEEqM3n3pSaHFXV-v6rQ5BK1Q&s" alt="Luxora" style="max-width: 150px;">
          </div>
    
          <!-- Greeting -->
          <h1 style="font-size: 24px; color: #1d72b8; text-align: center; margin-bottom: 20px;">Hello ${sellerName},</h1>
          
          <!-- Introduction -->
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Thank you for registering as a seller with Luxora! We're excited to have you on board. To complete your registration process, please use the One-Time Password (OTP) provided below. This will verify your email address and enable you to start selling on our platform.</p>
          
          <!-- OTP Display -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 20px; color: #333; font-weight: bold;">Your OTP is:</p>
            <h2 style="font-size: 36px; color: #1d72b8; font-weight: bold; letter-spacing: 2px;">${otp}</h2>
          </div>
          
          <!-- Instructions -->
          <p style="font-size: 16px; line-height: 1.6; color: #555;">Enter this OTP on the registration page to complete your sign-up process. Please note that this OTP will expire in 10 minutes, so be sure to use it promptly.</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">If you did not request this OTP or are having trouble registering, please <a href="mailto:luxora.team.2025@gmail.com" style="color: #1d72b8; text-decoration: none; font-weight: bold;">contact our support team</a> immediately.</p>
    
          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; font-size: 14px; color: #888;">
            <p>Best regards,</p>
            <p style="font-weight: bold; color: #1d72b8;">The Luxora Team</p>
          </div>
    
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
            <p>&copy; ${new Date().getFullYear()} Luxora. some rights reserved.</p>
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
      // console.log(info);
    });

    await next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};


function getTime(){
  const currentDateTime = new Date();
  const currentDate = currentDateTime.toISOString().split("T")[0];
  
  const hours = currentDateTime.getHours();
  const minutes = currentDateTime.getMinutes();
  const seconds = currentDateTime.getSeconds();
  const currentTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // req.sendingDate = currentDate;
  // req.sendingTime = currentTime;

  return {currentTime, currentDate};
}