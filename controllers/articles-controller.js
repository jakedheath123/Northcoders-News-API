const {
  fetchArticleById,
  updateArticleById,
  insertCommentByArticleId,
  fetchCommentsByArticleId,
  fetchAllArticles
} = require("../models/articles-model");

exports.getArticleById = function(request, response, next) {
  const { article_id } = request.params;

  return fetchArticleById(article_id)
    .then(function(article) {
      response.status(200).send({ article });
    })
    .catch(function(error) {
      next(error);
    });
};

exports.patchArticleById = function(request, response, next) {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  return updateArticleById(article_id, inc_votes)
    .then(function(article) {
      response.status(200).send({ article });
    })
    .catch(function(error) {
      next(error);
    });
};

exports.postCommentByArticleId = function(request, response, next) {
  const { article_id } = request.params;
  const { username } = request.body;
  const { body } = request.body;

  return insertCommentByArticleId(article_id, username, body)
    .then(function(comment) {
      response.status(201).send({ comment });
    })
    .catch(function(error) {
      next(error);
    });
};

exports.getCommentsByArticleId = function(request, response, next) {
  const { article_id } = request.params;
  const { sort_by } = request.query;

  fetchCommentsByArticleId(article_id, sort_by)
    .then(function(comments) {
      response.status(200).send({ comments });
    })
    .catch(function(error) {
      console.log(error);
      next(error);
    });
};

exports.getAllArticles = function(request, response, next) {
  fetchAllArticles().then(function(articles) {});
};
