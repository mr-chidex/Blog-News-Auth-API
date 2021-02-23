const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const blogs = require("./routes/blog");
const news = require("./routes/news");
const admin = require("./routes/admin");
const file = require("./routes/file");
const oauth = require("./routes/oauth");
const PORT = process.env.PORT || 4000;
const logger = require("./middleware/logger");

//connect DB
mongoose
  .connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    logger.log("info", "database connected...");

    //start server
    app.listen(PORT, () =>
      logger.log("info", `server running on port ${PORT}...`)
    );
  })
  .catch((err) => {
    //log error
    logger.log("error", "error connecting to database");
  });

app.use(morgan("dev"));
app.use("/images", express.static(path.join(__dirname, "./", "images")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/pdfs", express.static(path.join(__dirname, "./", "pdfs")));

//routes
app.use("/api/v1/blogs", blogs);
app.use("/api/v1/news", news);
app.use("/api/v1/admin", admin);
// app.use("/api/v1/file", file);
app.use("/api/v1/oauth", oauth);

//catching error
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: error.message });
  //log error
  logger.log("error", error.message);
});
