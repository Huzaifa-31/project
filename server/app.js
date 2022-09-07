const express = require("express");

const dotenv = require("dotenv");
const app = express();

//ENV

dotenv.config({ path: "./.env" });
//DB
// require database file
require("./database/conn");
//model
// const User = require("./models/userModel");
app.use(express.json());

//require routes ...to make routes easy
app.use(require("./routes/auth"));

//port
const PORT = process.env.PORT;

//middleware

const middleware = (req, res, next) => {
  console.log("middleware");
  next();
};
// middleware();

app.get("/", (req, res) => {
  res.send(`server started`);
});

app.get("/signin", middleware, (req, res) => {
  res.send(`signin`);
  console.log("middleware signin");
});

app.get("/signup", (req, res) => {
  res.send(`signup `);
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
