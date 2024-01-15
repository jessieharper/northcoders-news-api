const express = require("express");
const { getTopics, getApi } = require("./controllers/app.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getApi);

// app.use(handleCustomErrors);
// app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
