const connection = require("../db/connection");

exports.fetchTopics = function() {
  return connection.select("*").from("topics");
};
