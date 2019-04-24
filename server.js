const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const router = require("./routes/api")

const API_PORT = 3001;
const app = express();

const cors = require("cors");

app.use(cors());


const dbRoute = "mongodb://localhost/BasicMERNApp";

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));


db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger("dev"));


app.use("/api", router);


app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
