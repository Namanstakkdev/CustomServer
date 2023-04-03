const UserModel = require("../models/UserModel");
const PassResetModel = require("../models/PassResetModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { AUTH_EMAIL, AUTH_PASSWORD } = require("../config/config.json");
const bcrypt = require("bcrypt");

const maxAge = 7 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "dadua90dujfoiehroqh4r931h4913b53154109", {
    expiresIn: maxAge,
  });
};
const handleErrors = (err) => {
  let errors = { email: "", password: "", phone: "", password: "" };

  if (err.message === "Incorrect Email")
    errors.email = "This email is not registered";

  if (err.message === "Incorrect password")
    errors.email = "Password is incorrect";

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;
    const user = await UserModel.create({ username, email, phone, password });
    res.status(201).json({ user: user._id, email: email, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);

    res.cookie("user_token", token, {
      withCrdentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.signOut = async (req, res) => {
  console.log("Signout runned");
  res.clearCookie("user_token");
  res.json({ success: true, message: "Sign out successfully Done!" });
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const sendOTP = async (email) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: AUTH_EMAIL,
          pass: AUTH_PASSWORD,
        },
      });

      const number = Math.floor(Math.random() * 8999 + 1000);
      const code = number.toString();

      var mailOptions = {
        from: "testemailstakkdev@gmail.com",
        to: email,
        subject: "Verification Code from the Ecommerce Barcode App",
        text: "Your Verification code is :" + code,
      };
      await PassResetModel.deleteOne({ email: email }).then().catch();
      await PassResetModel.create({
        email,
        resetOTP: code,
        createdAt: Date.now(),
        expiresAt: Date.now() + 36000000,
      });

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    };
    sendOTP(email);
    res
      .status(201)
      .json({ status: "SUCCESS", message: "OTP Sent Successfully" });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, message: "OTP not sent error occurred" });
  }
};

module.exports.test = (req, res, next) => {
  console.log("Test Runned");
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    await PassResetModel.find({ email }).then((data) => {
      if (data[0].expiresAt < Date.now()) {
        PassResetModel.deleteOne({ email }).then(() => {
          res.status(400).json({ status: "Failed", message: "Token Expired" });
        });
      } else {
        console.log("OTP" + otp);
        console.log("resetOTP" + data[0].resetOTP);
        if (otp == data[0].resetOTP) {
          var encryptedpassword;
          process.nextTick(async () => {
            encryptedpassword = await encryptpass(password);
            UserModel.updateOne(
              { email: email },
              { $set: { password: encryptedpassword } }
            ).then(() => {
              res.status(400).json({
                status: "Success",
                message: "Password Reset Successful",
              });
            });
            // .then(() => {
            //   // PassResetModel.deleteOne({ email }).then(() => {
            //   res.status(400).json({
            //     status: "Success",
            //     message: "Password Reset Successful",
            //   });
          });
          // });
        } else {
          res
            .status(400)
            .json({ status: "Failed", message: "OTP Verification Failed" });
        }
      }
    });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

const encryptpass = async (password) => {
  const salt = await bcrypt.genSalt();
  const encryptedpassword = await bcrypt.hash(password, salt);
  console.log("Inside func" + encryptedpassword);
  return encryptedpassword;
};
