const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const userRouter = require('./route/userRoute')
const adminRouter = require('./route/adminRoutes')
const app = express();

dotenv.config();
connectDB();


app.use(express.json());
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(8000, (req, res) => {
  console.log("server is running at 8000");
});
