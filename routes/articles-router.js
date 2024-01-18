const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsById,
  postComments,
  patchArticleVotes,
} = require("../controllers/app.controllers");

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsById)
  .post(postComments);

module.exports = articlesRouter;
