const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-controller");
const { handle405Errors } = require("../errors/index");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405Errors);

module.exports = topicsRouter;
