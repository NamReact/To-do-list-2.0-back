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
      const checkUser = await User.findOne({ email: req.body.email });
      if (checkUser) {
        return res.status(409).json("This email is already used");
      }
      if (req.body.email && req.body.password) {
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
            pass: process.env.NOREPLY_PASSWORD
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
        return res.status(200).json(user.token);
      }
    }
    return res.status(400).json("Bad request");
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* GET */

router.get("/user", authentification, (req, res) => {
  try {
    const userReturn = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email
    };
    return res.status(200).json(userReturn);
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* UPDATE */

router.post("/user/update", authentification, async (req, res) => {
  try {
    if (req.body) {
      const { firstName, lastName, email } = req.body;
      const { user } = req;
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      await user.save();
      /*   const userReturn = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }; */
      return res.status(200);
    }
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* Password change */

router.post("/user/change-password", authentification, async (req, res) => {
  try {
    if (req.body) {
      const { user } = req;
      const { currentPassword, newPassword } = req.body;

      const loginHash = sha256(currentPassword + user.salt);
      if (loginHash === user.hash) {
        const salt = uid2(16);
        const token = uid2(16);
        user.salt = salt;
        user.token = token;
        user.hash = sha256(newPassword + salt);
        await user.save();
        res.status(200).json("Password changed");

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "noreply.nam.todolist@gmail.com",
            pass: process.env.NOREPLY_PASSWORD
          }
        });
        let info = await transporter.sendMail({
          from: '"Nam" <noreply.nam.todolist@gmail.com>',
          to: user.email,
          subject: "Password changed",
          text:
            "Hey ! Your password has successfully been changed. If you did not request a new password, please contact me.",
          html:
            "<p>Hey ! Your password has successfully been changed. If you did not request a new password, please contact me. <br/><br/>Here is your new password : <br/><br/>" +
            req.body.newPassword +
            "<br/><br/>Nam</p>"
        });
        return;
      }
      return res.status(401).json("Unauthorized");
    }
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* LOGIN */

router.post("/user/login", async (req, res) => {
  try {
    if (req.body) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json("Not found");
      }
      const loginHash = sha256(req.body.password + user.salt);
      if (loginHash === user.hash) {
        return res.status(200).json(user.token);
      }
      return res.status(401).json("Unauthorized");
    }
    return res.status(400).json("Bad request");
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* Forgot password */

router.post("/user/forgot-password", async (req, res) => {
  try {
    if (req.body) {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json("Email doesnt exist");
      }
      user.forgotPasswordToken = uid2(16);
      await user.save();
      res.status(200).json("Email sent");
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "noreply.nam.todolist@gmail.com",
          pass: process.env.NOREPLY_PASSWORD
        }
      });
      let info = await transporter.sendMail({
        from: '"Nam" <noreply.nam.todolist@gmail.com>',
        to: user.email,
        subject: "Password reset request",
        text:
          "Hey ! Your password can be reset by clicking the link below. If you did not request a new password, please ignore this email.",
        html:
          "<p>Hey ! Your password can be reset by clicking the link below. If you did not request a new password, please ignore this email. <br/><br/><a href=`http://todo-list-nam.herokuapp.com/reset/`" +
          user.forgotPasswordToken +
          "/>Reset my password<a><br/><br/>Nam</p>"
      });
      return;
    }
    return res.status(400).json("Bad request");
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* Reset Password */

router.post("/user/reset-password", async (req, res) => {
  try {
    if (req.body) {
      const user = await User.findOne({ forgotPasswordToken: req.body.token });
      if (!user) {
        return res.status(404).json("Not found");
      }
      const salt = uid2(16);
      const token = uid2(16);
      user.salt = salt;
      user.token = token;
      user.hash = sha256(req.body.newPassword + salt);
      await user.save();
      res.status(200).json("Password changed");

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "noreply.nam.todolist@gmail.com",
          pass: process.env.NOREPLY_PASSWORD
        }
      });
      let info = await transporter.sendMail({
        from: '"Nam" <noreply.nam.todolist@gmail.com>',
        to: user.email,
        subject: "Password changed",
        text:
          "Hey ! Your password has successfully been changed. If you did not request a new password, please contact me.",
        html:
          "<p>Hey ! Your password has successfully been changed. If you did not request a new password, please contact me. <br/><br/>Here is your new password : <br/><br/>" +
          req.body.newPassword +
          "<br/><br/>Nam</p>"
      });
    }
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* DELETE */

router.post("/user/delete", authentification, async (req, res) => {
  try {
    const { user } = req;
    await user.remove();
    return res.status(200);
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

module.exports = router;
