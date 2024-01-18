const commentsRouter = require("express").Router();
const { deleteComments } = require("../controllers/app.controllers");

commentsRouter.delete("/:comment_id", deleteComments);

module.exports = commentsRouter;
