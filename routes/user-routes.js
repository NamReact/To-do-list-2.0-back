const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const sha256 = require("js-sha256");

const User = require("../models/user-model");
const authentification = require("../middlewares/authentification");

const nodemailer = require("nodemailer");

/* CREATE */

router.post("/user/create", async (req, res) => {
  try {
    if (req.body) {
      const salt = uid2(16);
      const user = await new User({
        email: req.body.email,
        token: uid2(16),
        salt: salt,
        hash: sha256(req.body.password + salt)
      });

      await user.save();

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "noreply.nam.todolist@gmail.com",
          pass: "Noreplytodolist2"
        }
      });
      let info = await transporter.sendMail({
        from: '"Nam" <noreply.nam.todolist@gmail.com>',
        to: user.email,
        subject: "Welcome",
        text: "Hi ! Thanks for trying out my app.",
        html:
          "<p>Hi !,<br/><br/>Thanks for trying out my app ! <br/><br/> Here are your log in informations : <br/> <br/> email : " +
          req.body.email +
          "<br/> password : " +
          req.body.password +
          "<br/> <br/> Have fun. <br/> <br/>Nam</p>"
      });
    }
    return res.status(400).json("Bad request");
  } catch (error) {
    return res.statusCode(400).json("Bad request");
  }
});

/* LOGIN */

router.post("/user/login", authentification, async (req, res) => {
  return res.status(200).json(req.user.token);
});

module.exports = router;
