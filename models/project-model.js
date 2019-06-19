const mongoose = require("mongoose");

const Project = mongoose.model("Project", {
  title: String,
  leader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: String,
  tasks: [
    {
      title: String,
      status: String,
      numberOfRessources: Number,
      ressources: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      startDate: String,
      length: String,
      messages: [
        {
          title: String,
          from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          date: String
        }
      ]
    }
  ]
});

module.exports = Project;
