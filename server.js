const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/AuthRoutes");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB =require('./models/connectDB')
const {PORT_NO} = require("./config/config.json")


app.listen(PORT_NO || 4001, () => {
  console.log(`Server started at port Port no. ${PORT_NO}`);
});

connectDB;

app.use(
  cors({
    origin: ["*"],
    method: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", authRoutes);
