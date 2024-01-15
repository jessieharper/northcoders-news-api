const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
  it("GET: 200 should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(result.body.topics.length).toBe(3);
        result.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("description", expect.any(String));
          expect(topic).toHaveProperty("slug", expect.any(String));
        });
      });
  });
});

describe("GET: /api", () => {
  it("GET: 200 should respond with an object that describes all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
        expect(typeof result.body).toBe("object");
        expect(result.body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  it("GET: 200 should respond with an article object with the correct properties ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((result) => {
        result.body.articles.forEach((article) => {
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
      });
  });
  it("GET: 404 should respond with an appropriate error message when provided a valid id that does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  it("GET: 400 should respond with an appropriate error message when provided an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
});
