const connection = require("../db/connection");

exports.fetchUserByUsername = function(username) {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then(function([user]) {
      if (!user) return Promise.reject({ status: 404, msg: "User not found" });
      return user;
    });
};
