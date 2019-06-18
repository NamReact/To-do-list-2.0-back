const mongoose = require("mongoose");

const Agenda = mongoose.model("Agenda", {
  userId: String,
  pages: [
    {
      date: String,
      tasks: [
        {
          done: { type: Boolean, default: false },
          title: String
        }
      ]
    }
  ]
});

module.exports = Agenda;
