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
