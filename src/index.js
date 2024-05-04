const express = require("express");
const route = require("./router/route");
const mongoose = require("mongoose");
const app = express();
const { initializePassport } = require('./middleware/config');

app.use(initializePassport());

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://stuti3007:w14E1dmx6wAE1h7i@cluster0.rrvbnsb.mongodb.net/knovator"
  )
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => err);

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("express is running on Port " + (process.env.PORT || 3000));
});

