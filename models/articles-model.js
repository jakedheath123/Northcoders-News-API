const connection = require("../db/connection");

exports.fetchArticleById = function(article_id) {
  return connection("articles")
    .select(
      "articles.article_id",
      "articles.author",
      "articles.body",
      "articles.created_at",
      "title",
      "topic",
      "articles.votes"
    )
    .where("articles.article_id", article_id)
    .count("comments.comment_id AS comment_count")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .then(function([article]) {
      if (!article)
        return Promise.reject({ status: 404, msg: "Article not found" });
      return article;
    });
};

exports.updateArticleById = function(article_id, inc_votes = 0) {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(function([result]) {
      if (!result)
        return Promise.reject({ status: 404, msg: "Article not found" });

      return result;
    });
};

exports.insertCommentByArticleId = function() {};
