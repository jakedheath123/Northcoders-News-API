const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  console.log("help me");
  return knex.migrate
    .rollback()
    .then(function() {
      return knex.migrate.latest();
    })
    .then(function() {
      const topicsInsertions = knex("topics").insert(topicData);

      const usersInsertions = knex("users").insert(userData);

      return Promise.all([topicsInsertions, usersInsertions]).then(function() {
        const formattedArticles = formatDates(articleData);

        return knex
          .insert(formattedArticles)
          .into("articles")
          .returning("*");
      });
    })
    .then(function(articleRows) {
      const articleRef = makeRefObj(articleRows);

      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments").insert(formattedComments);
    });
};
