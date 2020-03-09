const commentsRouter = require("express").Router();
const { patchCommentById } = require("../controllers/comments-controller");
const { handle405Errors } = require("../errors/index");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .all(handle405Errors);

module.exports = commentsRouter;
