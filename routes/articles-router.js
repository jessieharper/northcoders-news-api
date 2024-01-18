const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsById,
  postComments,
  patchVotes,
} = require("../controllers/app.controllers");

articlesRouter.get("/", getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(postComments);

module.exports = articlesRouter;
