process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("Northcoders News API", function() {
  beforeEach(function() {
    return connection.seed.run();
  });
  describe("/api", function() {
    describe("/topics", function() {
      describe("GET", function() {
        test("Status : 200 - Responds with an array of all topics objects on the key of topics", function() {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(function({ body: { topics } }) {
              expect(Array.isArray(topics)).toBe(true);
            });
        });
        test("Status : 200 - Topic objects have correct keys", function() {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(function({ body: { topics } }) {
              expect(topics[0]).toHaveProperty("slug");
              expect(topics[0]).toHaveProperty("description");
            });
        });
        test("Status : 200 - Array has matching length to database", function() {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(function({ body: { topics } }) {
              expect(topics).toHaveLength(3);
            });
        });
        test("Status : 404 - Responds with 404 route not found when no routes are found", function() {
          return request(app)
            .get("/api/to")
            .expect(404)
            .then(function({ body }) {
              expect(body.msg).toEqual("Route not found");
            });
        });
      });
    });
    describe("/users", function() {
      describe("/:username", function() {
        describe("GET", function() {
          test("Status : 200 - Responds with a single user by username", function() {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200);
          });
        });
      });
    });
  });
  describe("Un-recognized path", function() {
    test("Status : 404 - Responds with 404 route not found when no routes are found", function() {
      return request(app)
        .get("/api/to")
        .expect(404)
        .then(function({ body }) {
          expect(body.msg).toEqual("Route not found");
        });
    });
  });

  afterAll(function() {
    return connection.destroy();
  });
});
