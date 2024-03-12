const searchRouter = require("express").Router();
const { searchContent } = require("../controllers/app.controllers");

searchRouter.route("/").get(searchContent);

module.exports = searchRouter;
