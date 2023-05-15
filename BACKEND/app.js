const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(__dirname + "/uploads/images"));

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

console.log(process.env.DB_USER,process.env.DB_NAME,process.env.DB_PASSWORD);

mongoose
  .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@storage.p18vofd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, // enter mongodb connection string
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  .then(() => {
    app.listen(process.env.PORT || 5000);   // process.env.PORT || 5000
    console.log("connect");
  })
  .catch((err) => {
    console.log(err);
  });
