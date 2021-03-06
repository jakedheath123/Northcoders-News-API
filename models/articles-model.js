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

exports.insertCommentByArticleId = function(article_id, username, body) {
  return connection("comments")
    .insert({ author: username, article_id: article_id, body: body })
    .returning("*")
    .then(function([comment]) {
      if (!comment)
        return Promise.reject({ status: 404, msg: "Article id not found" });

      return comment;
    });
};

exports.fetchAllArticles = function(
  sort_by = "articles.created_at",
  order = "desc",
  author,
  topic
) {
  if (order !== "asc" && order !== "desc")
    return Promise.reject({ status: 400, msg: "Bad request" });
  return connection("articles")
    .select(
      "articles.article_id",
      "articles.author",
      "articles.created_at",
      "title",
      "topic",
      "articles.votes"
    )
    .modify(function(query) {
      if (author) query.where("articles.author", "=", author);
      if (topic) query.where("topic", "=", topic);
    })
    .count("comments.comment_id AS comment_count")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order);
};

exports.fetchCommentsByArticleId = function(
  article_id,
  sort_by = "created_at",
  order = "desc"
) {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", article_id)
    .orderBy(sort_by, order);
};

exports.checkArticleExists = function(article_id) {
  return connection("articles")
    .where("article_id", article_id)
    .then(function([article]) {
      if (!article)
        return Promise.reject({ status: 404, msg: "Article id not found" });
      return article;
    });
};

exports.checkAuthorExists = function(author) {
  return connection("users")
    .where("username", author)
    .then(function([user]) {
      if (user === undefined)
        return Promise.reject({ status: 404, msg: "Author not found" });
      return user;
    });
};

exports.checkTopicExists = function(topic) {
  return connection("topics")
    .where("slug", topic)
    .then(function([result]) {
      if (!result)
        return Promise.reject({ status: 404, msg: "Topic not found" });
      return result;
    });
};
