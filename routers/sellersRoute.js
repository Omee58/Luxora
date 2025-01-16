const express = require('express');
const router = express.Router();
const controller = require('../controllers/sellersController');
let OTP, seller ;

router.get('/', (req, res) => {
    res.render('sellerRegistrationForm')
});

// info : when new sellers register, the data will be post here.
router.post('/sellerRegistrationForm', controller.sendOTP, async (req, res) => {
    OTP = await req.otp;
    seller = await req.seller;
    date = await req.sendingDate
    time = await req.sendingTime
    
    res.render('mailVerification' ,{OTP, seller, date, time})
});

router.post('/otpVerification', async (req, res) => {
    let otp = await (Number(req.body.otp));
    if(otp === OTP){
        res.redirect('/sellers/mail-verification')
    } else {
        res.send('Invalid OTP')
    }
})

router.get('/mail-verification',  (req, res) => {
    res.send('mail is Verified by Otp '+ OTP)
})

module.exports = router;