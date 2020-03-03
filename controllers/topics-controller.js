const { fetchTopics } = require("../models/topics-model");

exports.getTopics = function(request, response, next) {
  return fetchTopics()
    .then(function(topics) {
      response.status(200).send({ topics });
    })
    .catch(function(error) {
      next(error);
    });
};
