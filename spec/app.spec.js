process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const { checkIsAscending, checkIsDescending } = require("./custom-matchers");

expect.extend({
  toBeAscendingBy(
    received,
    column,
    shouldBeNumbers = { shouldBeNumbers: false }
  ) {
    const pass = checkIsAscending(received, {
      key: column,
      ...shouldBeNumbers
    });
    if (pass) {
      return {
        message: () => "is ascending all good!",
        pass: true
      };
    } else {
      return {
        message: () =>
          `[${JSON.stringify(received[0])},${JSON.stringify(
            received[1]
          )}...] is not in ascending order`,
        pass: false
      };
    }
  }
});
expect.extend({
  toBeDescendingBy(
    received,
    column,
    shouldBeNumbers = { shouldBeNumbers: false }
  ) {
    const pass = checkIsDescending(received, {
      key: column,
      ...shouldBeNumbers
    });
    if (pass) {
      return {
        message: () => "is descending all good!",
        pass: true
      };
    } else {
      return {
        message: () =>
          `[${JSON.stringify(received[0])},${JSON.stringify(
            received[1]
          )}...] is not in descending order`,
        pass: false
      };
    }
  }
});

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
      describe("Invalid Methods", function() {
        test("Status : 405 - Provided invalid method", function() {
          const invalidMethods = ["delete", "patch", "put", "post"];
          const promiseArray = invalidMethods.map(function(method) {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(function({ body: { msg } }) {
                expect(msg).toEqual("Method not allowed");
              });
          });
          return Promise.all(promiseArray);
        });
      });
    });
    describe("/comments", function() {
      describe("PATCH", function() {
        test("Status : 200 - Successfully increases votes key value when passed a positive number", function() {
          return request(app)
            .patch("/api/comments/1")
            .send({
              inc_votes: 5
            })
            .expect(200)
            .then(function({ body: { comment } }) {
              expect(comment.votes).toBe(21);
            });
        });
        test("Status : 200 - Successfully decreases votes key value when passed a negative number", function() {
          return request(app)
            .patch("/api/comments/1")
            .send({
              inc_votes: -5
            })
            .expect(200)
            .then(function({ body: { comment } }) {
              expect(comment.votes).toBe(11);
            });
        });
        test("Status : 200 - Response comment is one object, on a key of comment", function() {
          return request(app)
            .patch("/api/comments/1")
            .send({
              inc_votes: 5
            })
            .expect(200)
            .then(function({ body: { comment } }) {
              expect(typeof comment).toEqual("object");
              expect(Array.isArray(comment)).toBe(false);
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
      describe("GET", function() {
        test("Status : 200 - Responds with an array of all article objects with correct properties, on the key of articles", function() {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(function({ body: { articles } }) {
              expect(Array.isArray(articles)).toBe(true);
              expect(articles[0]).toContainKeys([
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              ]);
            });
        });
        test("Status : 200 -  Returns sorted by created_at by default, which defaults to descending", function() {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(function({ body: { articles } }) {
              const formattedComments = articles.map(({ created_at }) => {
                return new Date(created_at);
              });
              expect(articles).toBeDescendingBy("articles.created_at");
            });
        });
        test("Status : 200 - Accepts 'sort_by' query - Can sort by author", function() {
          return request(app)
            .get("/api/articles?sort_by=articles.author")
            .expect(200)
            .then(function({ body: { articles } }) {
              expect(articles).toBeDescendingBy("articles.author");
            });
        });
        test("Status : 200 - Accepts 'sort_by' query - Can sort by votes", function() {
          return request(app)
            .get("/api/articles?sort_by=articles.votes")
            .expect(200)
            .then(function({ body: { articles } }) {
              expect(articles).toBeDescendingBy("articles.votes");
            });
        });
        test("Status : 200 - Accepts 'sort_by' query - Can sort by article_id", function() {
          return request(app)
            .get("/api/articles?sort_by=articles.article_id")
            .expect(200)
            .then(function({ body: { articles } }) {
              expect(articles).toBeDescendingBy("articles.article_id");
            });
        });
        test("Status : 200 - Accepts 'order' query - Can set to asc for ascending", function() {
          return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(function({ body: { articles } }) {
              expect(articles).toBeAscendingBy("title");
            });
        });
        test("Status : 200 - Accepts 'order' query - Can set to desc for descending", function() {
          return request(app)
            .get("/api/articles/?sort_by=articles.article_id&order=desc")
            .expect(200)
            .then(function({ body: { articles } }) {
              expect(articles).toBeDescendingBy("articles.article_id");
            });
        });
        xtest("Status : 200 - Accepts 'author' query - Can filter articles by username value specified in the query", function() {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200);
        });
        test("Status : 400 - Responds with bad request when provided with invalid column to sort_by", function() {
          return request(app)
            .get("/api/articles/?sort_by=invalid")
            .expect(400)
            .then(function({ body: { msg } }) {
              expect(msg).toEqual("Bad request");
            });
        });
        test("Status : 400 - Responds with a bad request when passed an invalid order", function() {
          return request(app)
            .get("/api/articles/?sort_by=comment_count&order=improve")
            .expect(400)
            .then(function({ body: { msg } }) {
              expect(msg).toEqual("Bad request");
            });
        });
        test("Status : 404 - Responds with route not found when route is not found", function() {
          return request(app)
            .get("/api/article")
            .expect(404)
            .then(function({ body: { msg } }) {
              expect(msg).toEqual("Route not found");
            });
        });
      });
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
          test("Status : 200 - Response article contains correct keys", function() {
            return request(app)
              .patch("/api/articles/1")
              .send({
                inc_votes: 5
              })
              .expect(200)
              .then(function({ body: { article } }) {
                expect(article).toContainKeys([
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at"
                ]);
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
        });

        describe("/comments", function() {
          describe("POST", function() {
            test("Status : 201 - Returns with posted comment", function() {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  username: "butter_bridge",
                  body: "I loved reading this article"
                })
                .expect(201)
                .then(function({ body: { comment } }) {
                  expect(comment).toContainKeys([
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body"
                  ]);
                  expect(comment.body).toEqual("I loved reading this article");
                  expect(comment.comment_id).toBe(19);
                });
            });
            test("Status : 400 - Incorrect data type for article_id", function() {
              return request(app)
                .post("/api/articles/hello/comments")
                .send({
                  username: "butter_bridge",
                  body: "This is the one"
                })
                .expect(400)
                .then(function({ body: { msg } }) {
                  expect(msg).toEqual("Bad request");
                });
            });
            test("Status : 400 - Provided unwanted columns", function() {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  username: "butter_bridge",
                  job: "Coder"
                })
                .expect(400)
                .then(function({ body: { msg } }) {
                  expect(msg).toEqual("Bad request");
                });
            });
            test("Status : 400 - Missing keys", function() {
              return request(app)
                .post("/api/articles/1/comments")
                .send({
                  body: "Very good read"
                })
                .expect(400)
                .then(function({ body: { msg } }) {
                  expect(msg).toEqual("Bad request");
                });
            });
            xtest("Status : 404 - Fails on id reference", function() {
              return request(app)
                .post("/api/articles/123456/comments")
                .send({
                  username: "butter_bridge",
                  body: "One two three"
                })
                .expect(404)
                .then(function({ body: { msg } }) {
                  expect(msg).toEqual("Article id is not found");
                });
            });
            xtest("Status : 400 - Entered wrong data type", function() {});
          });
          describe("GET", function() {
            test("Status : 200 - Responds with array of objects of comments for chosen article_id, on the key of comments", function() {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(function({ body: { comments } }) {
                  expect(Array.isArray(comments)).toBe(true);
                });
            });
            test("Status : 200 - Responds with correct array length to number of comments for article_id in database", function() {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(function({ body: { comments } }) {
                  expect(comments).toHaveLength(13);
                });
            });
            test("Status : 200 - Response with correct keys in each object", function() {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(function({ body: { comments } }) {
                  expect(comments[0]).toContainKeys([
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  ]);
                  expect(comments[4]).toContainKeys([
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  ]);
                });
            });
            test("Status : 200 - Returns sorted by created_at by default, which defaults to descending", function() {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(function({ body: { comments } }) {
                  const formattedComments = comments.map(({ created_at }) => {
                    return new Date(created_at);
                  });
                  expect(comments).toBeDescendingBy("created_at");
                });
            });
            test("Status : 200 - Accepts 'sort_by' query - Can sort by votes", function() {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(function({ body: { comments } }) {
                  expect(comments).toBeDescendingBy("votes");
                });
            });
            test("Status : 200 - Accepts 'sort_by' query - Can sort by comment_id", function() {
              return request(app)
                .get("/api/articles/1/comments?sort_by=comment_id")
                .expect(200)
                .then(function({ body: { comments } }) {
                  expect(comments).toBeDescendingBy("comment_id");
                });
            });
            test("Status : 200 - Accepts 'sort_by' query - Can sort by author", function() {
              return request(app)
                .get("/api/articles/1/comments?sort_by=author")
                .expect(200)
                .then(function({ body: { comments } }) {
                  expect(comments).toBeDescendingBy("author");
                });
            });
            test("Status : 200 - Accepts 'order' query - Can set to asc for ascending", function() {
              return request(app)
                .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
                .expect(200)
                .then(function({ body: { comments } }) {
                  expect(comments).toBeAscendingBy("comment_id");
                });
            });
            test("Status : 200 - Accepts 'order' query - Can set to desc for descending", function() {
              return request(app)
                .get("/api/articles/2/comments?sort_by=comment_id&order=desc")
                .expect(200)
                .then(function({ body: { comments } }) {
                  expect(comments).toBeDescendingBy("comment_id");
                });
            });

            test("Status : 400 - Responds with bad request when provided with invalid column to sort_by", function() {
              return request(app)
                .get("/api/articles/1/comments?sort_by=invalid")
                .expect(400)
                .then(function({ body: { msg } }) {
                  expect(msg).toEqual("Bad request");
                });
            });
            test("Status : 400 - Responds with a bad request when passed an invalid order", function() {
              return request(app)
                .get("/api/articles/1/comments?sort_by=author&order=improve")
                .expect(400)
                .then(function({ body: { msg } }) {
                  expect(msg).toEqual("Bad request");
                });
            });

            test("Status : 404 - Responds with route not found when route is not found", function() {
              return request(app)
                .get("/api/articles/1/comets?sort_by=author&order=asc")
                .expect(404)
                .then(function({ body: { msg } }) {
                  expect(msg).toEqual("Route not found");
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
