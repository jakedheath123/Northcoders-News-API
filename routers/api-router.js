const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const { sendAllEndpoints } = require("../controllers/api-controller");
const { handle405Errors } = require("../errors/index");

apiRouter
  .route("/")
  .get(sendAllEndpoints)
  .all(handle405Errors);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
