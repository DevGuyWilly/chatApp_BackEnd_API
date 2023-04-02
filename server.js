const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/users");
const userAuth = require("./routes/auth");
const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/api/users", userRoute);
app.use("/api/auth", userAuth);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to Home Page");
});
