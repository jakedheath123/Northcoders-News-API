const { updateCommentById } = require("../models/comments-model");

exports.patchCommentById = function(request, response, next) {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;

  updateCommentById(comment_id, inc_votes).then(function(comment) {
    response.status(200).send({ comment });
  });
};
