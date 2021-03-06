const {
  updateCommentById,
  removeCommentById
} = require("../models/comments-model");

exports.patchCommentById = function(request, response, next) {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;

  updateCommentById(comment_id, inc_votes)
    .then(function(comment) {
      response.status(200).send({ comment });
    })
    .catch(function(error) {
      next(error);
    });
};

exports.deleteCommentById = function(request, response, next) {
  const { comment_id } = request.params;

  removeCommentById(comment_id)
    .then(function(comment) {
      response.status(204).send({ comment });
    })
    .catch(function(error) {
      next(error);
    });
};
