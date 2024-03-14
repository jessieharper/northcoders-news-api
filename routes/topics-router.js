const topicsRouter = require("express").Router();
const {
  getTopics,
  postTopics,
  searchTopics,
} = require("../controllers/app.controllers");

topicsRouter.route("/").get(getTopics).post(postTopics);

topicsRouter.route("/search").get(searchTopics);

module.exports = topicsRouter;
