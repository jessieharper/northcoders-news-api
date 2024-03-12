const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");
const searchRouter = require("./search-router");

const { getApi } = require("../controllers/app.controllers");

apiRouter.get("/", getApi);

apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/search", searchRouter);

module.exports = apiRouter;
