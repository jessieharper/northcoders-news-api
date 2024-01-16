const express = require("express");
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsById,
  postComments,
  patchVotes,
} = require("./controllers/app.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postComments);
app.patch("/api/articles/:article_id", patchVotes);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
