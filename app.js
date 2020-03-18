const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  handle400Errors,
  handleCustomErrors,
  handle500Errors,
  handle422Errors
} = require("./errors/index");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", function(request, response, next) {
  response.status(404).send({ msg: "Route not found" });
});

app.use(handle400Errors);
app.use(handle422Errors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
