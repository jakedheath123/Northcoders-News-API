const { fetchUserByUsername } = require("../models/users-model");

exports.getUserByUsername = function(request, response, next) {
  const { username } = request.params;

  return fetchUserByUsername(username)
    .then(function(user) {
      response.status(200).send({ user });
    })
    .catch(function(error) {
      next(error);
    });
};
