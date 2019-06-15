const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json({ limit: "200mb" }));

const cors = require("cors");
app.use(cors());

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/to-do-list-2",
  {
    useNewUrlParser: true
  }
);

/* MODELS */

const User = require("./models/user-model");

/* ROUTES */

const userRoutes = require("./routes/user-routes");
app.use(userRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
