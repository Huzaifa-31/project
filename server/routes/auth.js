const express = require("express");
const router = express.Router();

//require jwt for giving access to user for other pages

const jwt = require("jsonwebtoken");

//require bcrypt for password

const bcrypt = require("bcryptjs");
//require database

require("../database/conn");

//require schema

const User = require("../models/userModel");
const e = require("express");
const { set } = require("mongoose");

router.get("/", (req, res) => {
  res.send(`server started`);
});

//using promises
// router.post("/signup",  (req, res) => {
//   const { name, email, password, cpassword } = req.body;

//   if (!name || !email || !password || !cpassword) {
//     return res.status(422).json({ error: "please fill the data properly" });
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already exist" });
//       }
//       const user = new User({ name, email, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "user stored successfuly" });
//         })
//         .catch((err) =>
//           res.status(500).json({ error: "user failed to register" })
//         );
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// through async await

router.post("/signup", async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "please fill the data properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password does not match" });
    } else {
      const user = new User({ name, email, password, cpassword });

      await user.save();

      res.status(201).json({ message: "user stored successfuly" });
    }
  } catch (err) {
    console.log(err);
  }
});

//sign in

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "plz fill the field" });
    }

    const userLogin = await User.findOne({ email: email });

    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      //generatting token

      const token = await userLogin.generateAuthToken();

      //saving token in cookie

      res.cookie("jwttoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      if (!isMatch) {
        res.status(400).json({ message: "user error: login unsuccessfully" });
      } else {
        res.json({ message: "user login successfully" });
      }
    } else {
      res.status(400).json({ message: "user error: login unsuccessfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
