const fs = require("fs");

exports.JsonEndpoints = function(request, response, next) {
  fs.readFile("endpoints.json", function(error, data) {
    console.log(data);
  });
};
