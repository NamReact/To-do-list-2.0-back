const express = require("express");
const router = express.Router();
const Agenda = require("../models/agenda-model");

const authentification = require("../middlewares/authentification");

/* CREATE */

router.post("/agenda/create", authentification, async (req, res) => {
  try {
    if (req.body) {
      const agenda = await Agenda.findOne({ userId: req.user._id });
      if (!agenda) {
        const newAgenda = new Agenda({
          userId: req.user._id,
          pages: [
            {
              date: req.body.date,
              tasks: [
                {
                  title: req.body.title
                }
              ]
            }
          ]
        });
        await newAgenda.save();
        return res.status(200).json(newAgenda);
      }
      for (let i = 0; i < agenda.pages.length; i++) {
        if (agenda.pages[i].date === req.body.date) {
          agenda.pages[i].tasks.push({ title: req.body.title });
          await agenda.save();
          return res.status(200).json(agenda);
        }
      }
      const newPage = {
        date: req.body.date,
        tasks: [
          {
            title: req.body.title
          }
        ]
      };
      agenda.pages.push(newPage);
      await agenda.save();
      return res.status(200).json(agenda);
    }
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* READ */

router.get("/agenda", authentification, async (req, res) => {
  try {
    const agenda = await Agenda.findOne({ userId: req.user._id });
    if (!agenda) {
      return res.status(202);
    }
    return res.status(200).json(agenda);
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* UPDATE */

router.post("/agenda/update/task", authentification, async (req, res) => {
  try {
    if (req.body) {
      const agenda = await Agenda.findOne({ userId: req.user._id });
      for (let i = 0; i < agenda.pages.length; i++) {
        if (agenda.pages[i].date === req.body.date) {
          for (let j = 0; j < agenda.pages[i].tasks.length; j++) {
            if (String(agenda.pages[i].tasks[j]._id) === String(req.body.id)) {
              agenda.pages[i].tasks[j].done = !agenda.pages[i].tasks[j].done;
              await agenda.save();
              return res.status(200).json(agenda);
            }
          }
        }
      }
    }
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

/* DELETE */

router.post("/agenda/delete/task", authentification, async (req, res) => {
  try {
    if (req.body) {
      const agenda = await Agenda.findOne({ userId: req.user._id });
      for (let i = 0; i < agenda.pages.length; i++) {
        if (agenda.pages[i].date === req.body.date) {
          for (let j = 0; j < agenda.pages[i].tasks.length; j++) {
            if (String(agenda.pages[i].tasks[j]._id) === String(req.body.id)) {
              agenda.pages[i].tasks.splice(j, 1);
              await agenda.save();
              return res.status(200).json(agenda);
            }
          }
        }
      }
    }
  } catch (error) {
    return res.status(400).json("Bad request");
  }
});

module.exports = router;
