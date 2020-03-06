const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getAllArticles
} = require("../controllers/articles-controller");

const { handle405Errors } = require("../errors/index");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handle405Errors);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405Errors);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(handle405Errors);

module.exports = articlesRouter;
