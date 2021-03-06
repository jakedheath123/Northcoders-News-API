const {
  fetchArticleById,
  updateArticleById,
  insertCommentByArticleId,
  fetchCommentsByArticleId,
  fetchAllArticles,
  checkArticleExists,
  checkAuthorExists,
  checkTopicExists
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
  const { username, body } = request.body;

  return insertCommentByArticleId(article_id, username, body)
    .then(function(comment) {
      response.status(201).send({ comment });
    })
    .catch(function(error) {
      next(error);
    });
};

exports.getAllArticles = function(request, response, next) {
  const { sort_by, order, author, topic } = request.query;

  const promises = [fetchAllArticles(sort_by, order, author, topic)];
  if (author) promises.push(checkAuthorExists(author));
  if (topic) promises.push(checkTopicExists(topic));

  Promise.all(promises)
    .then(function([articles]) {
      response.status(200).send({ articles });
    })
    .catch(function(error) {
      next(error);
    });
};

exports.getCommentsByArticleId = function(request, response, next) {
  const { article_id } = request.params;
  const { sort_by, order } = request.query;

  Promise.all([
    fetchCommentsByArticleId(article_id, sort_by, order),
    checkArticleExists(article_id)
  ])
    .then(function([comments]) {
      response.status(200).send({ comments });
    })
    .catch(function(error) {
      next(error);
    });
};
