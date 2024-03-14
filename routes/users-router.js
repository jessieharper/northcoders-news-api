const userRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  searchUsers,
} = require("../controllers/app.controllers");

userRouter.get("/", getUsers);
userRouter.get("/search", searchUsers);
userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
