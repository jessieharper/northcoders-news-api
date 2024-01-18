const topicsRouter = require("express").Router();
const { getTopics, postTopics } = require("../controllers/app.controllers");

topicsRouter.route("/").get(getTopics).post(postTopics);

module.exports = topicsRouter;
