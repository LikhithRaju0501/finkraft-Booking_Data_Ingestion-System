const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bookingsRoute = require("./api/bookings/booking");

const port = 5000;
const mongoString = process.env.MONGODB_URI;
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: "25mb" }));
app.use(bodyParser.json({ limit: "25mb" }));

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use("/bookings", bookingsRoute);
