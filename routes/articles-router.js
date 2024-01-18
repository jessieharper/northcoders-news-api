const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsById,
  postComments,
  patchArticleVotes,
  postArticles,
} = require("../controllers/app.controllers");

articlesRouter.route("/").get(getArticles).post(postArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(postComments);

module.exports = articlesRouter;
