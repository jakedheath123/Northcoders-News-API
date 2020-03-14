const connection = require("../db/connection");

exports.updateCommentById = function(comment_id, inc_votes = 0) {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(function([result]) {
      if (!result)
        return Promise.reject({ status: 404, msg: "Comment not found" });

      return result;
    });
};

exports.removeCommentById = function(comment_id) {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(function(result) {
      if (result === 0)
        return Promise.reject({ status: 404, msg: "Comment not found" });

      return result;
    });
};
