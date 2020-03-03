const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", function(request, response, next) {
  response.status(404).send({ msg: "Route not found" });
});
module.exports = app;
