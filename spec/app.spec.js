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
        test("Status : 200 - Topics objects have correct keys", function() {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(function({ body: { topics } }) {
              expect(topics[0]).toContainKeys(["slug", "description"]);
              expect(topics[0]).not.toContainKeys(["sl", "scription"]);
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
          test("Status : 200 - Responds with an object of a single user by username, on a key of user", function() {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(function({ body: { user } }) {
                expect(user).toEqual({
                  username: "butter_bridge",
                  name: "jonny",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                });
                expect(Array.isArray(user)).toBe(false);
                expect(typeof user).toEqual("object");
              });
          });
          test("Status : 200 - Response object contains correct keys and values", function() {
            return request(app)
              .get("/api/users/butter_bridge")
              .expect(200)
              .then(function({ body: { user } }) {
                expect(user).toContainKeys(["username", "name", "avatar_url"]);
                expect(user.username).toEqual("butter_bridge");
              });
          });
          test("Status : 404 - Provided a non-existent username", function() {
            return request(app)
              .get("/api/users/jimjonezzz")
              .expect(404)
              .then(function({ body: { msg } }) {
                expect(msg).toEqual("User not found");
              });
          });
        });
      });
    });
    describe("/articles", function() {
      describe("/:article_id", function() {
        describe("GET", function() {
          test("Status : 200 - Responds with an object of a single article by article_id, on a key of article", function() {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(function({ body: { article } }) {
                expect(Array.isArray(article)).toBe(false);
                expect(typeof article).toEqual("object");
              });
          });

          test("Status : 200 - Response article object includes correct keys and values", function() {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(function({ body: { article } }) {
                expect(article).toContainKeys([
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count"
                ]);
                expect(article.comment_count).toBe("13");
                expect(article.article_id).toBe(1);
              });
          });
          test("Status : 400 - Provided a non-valid ID", function() {
            return request(app)
              .get("/api/articles/one")
              .expect(400)
              .then(function(response) {
                expect(response.body.msg).toEqual("Bad request");
              });
          });
          test("Status : 404 - Provided a non-existent article_id", function() {
            return request(app)
              .get("/api/articles/99999999")
              .expect(404)
              .then(function({ body: { msg } }) {
                expect(msg).toEqual("Article not found");
              });
          });
        });
        describe("PATCH", function() {
          test("Status : 200 - Successfully increases votes key value when passed a positive number", function() {
            return request(app)
              .patch("/api/articles/1")
              .send({
                inc_votes: 5
              })
              .expect(200)
              .then(function({ body: { article } }) {
                expect(article.votes).toBe(105);
              });
          });
          test("Status : 200 - Successfully decreases votes key value when passed a negative number", function() {
            return request(app)
              .patch("/api/articles/1")
              .send({
                inc_votes: -100
              })
              .expect(200)
              .then(function({ body: { article } }) {
                expect(article.votes).toBe(0);
              });
          });
          test("Status : 200 - Response article is one object, on a key of article", function() {
            return request(app)
              .patch("/api/articles/1")
              .send({
                inc_votes: 50
              })
              .expect(200)
              .then(function({ body: { article } }) {
                expect(typeof article).toEqual("object");
                expect(Array.isArray(article)).toBe(false);
              });
          });
          test("Status : 404 - Provided a non-existent article_id", function() {
            return request(app)
              .patch("/api/articles/123456")
              .send({
                inc_votes: 50
              })
              .expect(404)
              .then(function({ body: { msg } }) {
                expect(msg).toEqual("Article not found");
              });
          });
          test("Status : 400 - Provided a non-valid ID", function() {
            return request(app)
              .patch("/api/articles/eleven")
              .send({
                inc_votes: 50
              })
              .expect(400)
              .then(function(response) {
                expect(response.body.msg).toEqual("Bad request");
              });
          });
          test("Status : 200 - Missing required fields, returns an object of the unchanged article on the key of article", function() {
            return request(app)
              .patch("/api/articles/1")
              .send({})
              .expect(200)
              .then(function({ body: { article } }) {
                expect(typeof article).toEqual("object");
                expect(Array.isArray(article)).toBe(false);
                expect(article.votes).toBe(100);
              });
          });
          test("Status : 400 - Provided incorrect data type", function() {
            return request(app)
              .patch("/api/articles/2")
              .send({
                inc_votes: "word"
              })
              .expect(400)
              .then(function(response) {
                expect(response.body.msg).toEqual("Bad request");
              });
          });
          xtest("Status : 400 - Provided more than one property on request body", function() {
            return request(app)
              .patch("/api/articles/2")
              .send({
                inc_votes: 1,
                name: "Mitch"
              })
              .expect(400)
              .then(function(response) {
                expect(response.body.msg).toEqual("Bad request");
              });
          });
        });
        /*
        Request body accepts an object with the following properties  
         username body
         Responds with the posted comment
        */
        describe("/comments", function() {
          describe("POST", function() {
            test("Status : 201 - Returns with posted comment", function() {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  username: "alpha123",
                  body: "I loved reading this article"
                })
                .expect(201)
                .then(function({ body: { comment } }) {
                  expect(comment).toEqual("I loved reading this article");
                });
            });
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
