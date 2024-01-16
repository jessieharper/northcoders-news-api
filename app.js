const express = require("express");
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsById,
  postComments,
  patchVotes,
  deleteComments,
  getUsers,
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
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchVotes);
app.delete("/api/comments/:comment_id", deleteComments);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not Found", status: 404 });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
