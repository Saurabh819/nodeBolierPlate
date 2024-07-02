const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db/db");
connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(3000, (req, res) => {
  console.log("server is running at 3000");
});
