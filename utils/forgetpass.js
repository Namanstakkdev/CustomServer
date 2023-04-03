const nodemailer = require('nodemailer')
const { AUTH_EMAIL, AUTH_PASSWORD }= require("../config/config.json")
const {PassResetModel}= require("../models/PassResetModel")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD,
    },
});

// JUST for Testing Transporter
// transporter.verify((error, success) => {
//     if (error) {
//         console.log(error)
//     }
//     else {
//         console.log("Ready to send Emails")
//         console.log(success)
//     }
// })

sendCustomMail = async (req,res) => {
    const {  email } = req.body;

    const number = Math.floor(Math.random() * 8999 + 1000);
    const code = number.toString();

    const mailoptions = {
        from: AUTH_EMAIL,
        to: email,
        subject: "Verification Code from the Ecommerce Barcode App",
        text: "Your Verification code is :" + code,
    };
    await PassResetModel.create({ email, resetOTP:code, createdAt:Date.now(), expiresAt: Date.now()+36000000 });

    transporter.sendMail(mailoptions, function (error, info) {
        if (error) { console.log(error) }
        else {
            console.log("Email has been send" + info.response);
        }
    });

}

module.exports= {sendCustomMail}