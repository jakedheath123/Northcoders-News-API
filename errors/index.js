exports.handle400Errors = function(error, request, response, next) {
  const psqlBadRequestCodes = ["22P02"];
  if (psqlBadRequestCodes.includes(error.code)) {
    response.status(400).send({ msg: "Bad request" });
  } else next(error);
};

exports.handleCustomErrors = function(error, request, response, next) {
  if (error.status) {
    response.status(error.status).send({ msg: error.msg });
  } else next(error);
};

exports.handle500Errors = function(error, request, response, next) {
  console.log(error);
  response.status(500).send({ msg: "Internal server error" });
};
