const commentsRouter = require("express").Router();
const {
  deleteComments,
  patchCommentVotes,
} = require("../controllers/app.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComments)
  .patch(patchCommentVotes);

module.exports = commentsRouter;
