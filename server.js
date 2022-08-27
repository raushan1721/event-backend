const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json({ extended: false }));

const cors = require("cors");
app.use(
  cors()
);

app.use(cookieParser());

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb connected!!"))
  .catch((err) => console.log(err));

app.use("/user", require("./src/router/user"));
app.use("/auth", require("./src/router/auth"));
app.use("/socialauth", require("./src/router/socialAuth"));
app.use("/profile", require("./src/router/profile"));
app.use("/guest", require("./src/router/guest"));
app.use("/event", require("./src/router/event"));
app.use("/vote", require("./src/router/votes"));
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log("server started on " + PORT));
