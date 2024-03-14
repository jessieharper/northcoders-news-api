const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsById,
  postComments,
  patchArticleVotes,
  postArticles,
  deleteArticles,
  searchArticles,
} = require("../controllers/app.controllers");

articlesRouter.route("/").get(getArticles).post(postArticles);

articlesRouter.route("/search").get(searchArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes)
  .delete(deleteArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(postComments);

module.exports = articlesRouter;
