const userRouter = require("express").Router();
const { getUsers } = require("../controllers/app.controllers");

userRouter.get("/", getUsers);

module.exports = userRouter;
