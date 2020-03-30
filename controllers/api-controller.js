const endpoints = require("../endpoints.json");

exports.sendAllEndpoints = (request, response, next) => {
  return response.status(200).send(endpoints);
};
