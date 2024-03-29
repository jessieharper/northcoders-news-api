const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const articles = require("../db/data/test-data/articles");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("ALL: /*", () => {
  it("ALL: 404 should respond with an apropriate error message when passed a non-existent url", () => {
    return request(app)
      .get("/invalid_url")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("Not Found");
      });
  });
});

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
        const article = result.body.articles[0];
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  it("GET: 404 should respond with an appropriate error message when provided a valid id that does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
  it("GET: 400 should respond with an appropriate error message when provided an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("GET: 200 should respond with an article object that contains a comment_count property", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((result) => {
        expect(result.body.articles[0]).toHaveProperty("comment_count", "2");
      });
  });
});

describe("GET: /api/articles", () => {
  it("GET: 200 should respond with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        expect(result.body.articles.length).toBe(13);
        result.body.articles.forEach((article) => {
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
  it("GET: 200 should respond with an object that is sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("GET: 200 should respond with an array of article objects that do not contain body properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        result.body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  it("GET: 200 should respond with an array of articles filtered by topic when the user provides a topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });
  it("GET: 200 should respond with an empty array when provided a valid query with no corresponding articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  it("GET: 404 should respond with an appropriate error message when passed a non-existent query", () => {
    return request(app)
      .get("/api/articles?topic=northcoders")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic Not Found");
      });
  });
  it("GET: 400 should respond with an appropriate error message when passed an invalid query", () => {
    return request(app)
      .get("/api/articles?1234=mitch")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("GET: 200 should respond with an array of articles sorted by a valid column when a sort_by query is provided", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  it("GET: 400 should respond with an appropriate error message when passed an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=0")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("GET: 200 should respond with an array of articles sorted by a valid column when an order query is provided", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("author", {
          ascending: true,
        });
      });
  });
  it("GET: 400 should respond with an appropriate error message when passed an invalid sort query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=0")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("GET: 200 should respond with array that contains a specified amount of articles when the user provides a limit query", () => {
    return request(app)
      .get("/api/articles?limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(2);
      });
  });
  it("GET: 200 should respond with an array of all of the articles when provided a valid limit query that is greater than the total articles", () => {
    return request(app)
      .get("/api/articles?limit=999")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
      });
  });
  it("GET: 400 should respond with an appropriate error message when passed an invalid limit query", () => {
    return request(app)
      .get("/api/articles?limit=mitch")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("GET: 200 should respond with array on a specific page when passed a page query", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=DESC&limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(3);
        expect(body.articles[0].title).toBe("Another article about Mitch");
        expect(body.articles[1].title).toBe("Am I a cat?");
        expect(body.articles[2].title).toBe("A");
      });
  });
  it("GET: 200 should respond with an empty arry when passed a valid p query that is greater than the amount of pages", () => {
    return request(app)
      .get("/api/articles?limit=13&p=999")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
        expect(body.articles).toEqual([]);
      });
  });
  it("GET: 400 should respond with an appropriate error message when passed an invalid p query", () => {
    return request(app)
      .get("/api/articles?limit=5&p=mitch")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  it("GET: 200 should respond with an array of comments for the given article_id with the correct properties ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments.length).toBe(11);
        result.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", 1);
        });
      });
  });
  it("GET: 200 should respond with an array of comments sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("GET: 200 should respond with an empty array when provided a valid article_id, but the article does not have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  it("GET: 404 should respond with an appropriate error message when provided a non-existent article", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
  it("GET: 400 should respond with an appropriate error message when provided an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("GET: 200 should respond with array that contains a specified amount of comments when the user provides a limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
      });
  });
  it("GET: 200 should respond with an array of all of the comments when provided a valid limit query that is greater than the total comments", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=999")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
      });
  });
  it("GET: 400 should respond with an appropriate error message when passed an invalid limit query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=mitch")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("GET: 200 should respond with array on a specific page when passed a page query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
        expect(body.comments[0].body).toBe("Lobster pot");
        expect(body.comments[1].body).toBe("Delicious crackerbreads");
      });
  });
  it("GET: 200 should respond with an empty array when passed a valid p query that is greater than the amount of pages", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=13&p=999")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
        expect(body.comments).toEqual([]);
      });
  });
  it("GET: 400 should respond with an appropriate error message when passed an invalid p query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=mitch")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  it("POST: 201 should allow a user to post a comment to a given article_id with the required properties and respond with the posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "this is cool.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.body).toBe("this is cool.");
        expect(comment.author).toBe("lurker");
        expect(comment.article_id).toBe(1);
        expect(typeof comment.created_at).toBe("string");
        expect(comment.votes).toBe(0);
      });
  });
  it("POST: 400 should respond with an appropriate status and error message when provided with a bad comment (no username)", () => {
    const newComment = {
      body: "this is cool.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  it("POST: 400 should respond with an appropriate status and error message when provided with an invalid article_id", () => {
    const newComment = {
      username: "lurker",
      body: "this is cool.",
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  it("POST: 404 should respond with an appropriate status and error message when provided with a non-existent article_id", () => {
    const newComment = {
      username: "lurker",
      body: "this is cool.",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article Not Found");
      });
  });
  it("POST: 404 should respond with an appropriate status and error message when provided with a non-existent username", () => {
    const newComment = {
      username: "coolUsername",
      body: "this is cool.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Username Not Found");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  it("PATCH: 200 should allow a user to increment the votes on a given article and respond with the updated article", () => {
    const updatedVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.title).toBe("Living in the shadow of a great man");
        expect(comment.body).toBe("I find this existence challenging");
        expect(comment.topic).toBe("mitch");
        expect(comment.author).toBe("butter_bridge");
        expect(comment.article_id).toBe(1);
        expect(typeof comment.created_at).toBe("string");
        expect(comment.votes).toBe(101);
        expect(comment.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  it("PATCH: 200 should allow a user to decrement the votes on a given article and respond with the updated article", () => {
    const updatedVotes = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.title).toBe("Living in the shadow of a great man");
        expect(comment.body).toBe("I find this existence challenging");
        expect(comment.topic).toBe("mitch");
        expect(comment.author).toBe("butter_bridge");
        expect(comment.article_id).toBe(1);
        expect(typeof comment.created_at).toBe("string");
        expect(comment.votes).toBe(99);
        expect(comment.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  it("PATCH: 200 should respond with the comment when no inc_votes is sent with the request", () => {
    const updatedVotes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.title).toBe("Living in the shadow of a great man");
        expect(comment.body).toBe("I find this existence challenging");
        expect(comment.topic).toBe("mitch");
        expect(comment.author).toBe("butter_bridge");
        expect(comment.article_id).toBe(1);
        expect(typeof comment.created_at).toBe("string");
        expect(comment.votes).toBe(100);
        expect(comment.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  it("PATCH: 400 should respond with an appropriate error messge when provided a bad patch request", () => {
    const updatedVotes = {
      inc_votes: "one",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  it("PATCH: 400 should respond with an appropriate status and error message when provided with an invalid article_id", () => {
    const updatedVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/invalid_id")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  it("PATCH: 404 should respond with an appropriate status and error message when provided with valid but non-existent article_id", () => {
    const updatedVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(updatedVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article Not Found");
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  it("DELETE: 204 should delete the specified comment and respond with the correct status", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("DELETE: 404 should respond with an appropriate status and error message when provided with valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment Not Found");
      });
  });
  it("DELETE: 400 should respond with an appropriate status and error message when provided with an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET: /api/users", () => {
  it("GET: 200 should respond with an array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .then((result) => {
        expect(result.body.users.length).toBe(4);
        result.body.users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("GET: /api/users/:username", () => {
  it("GET: 200 should respond with user object that contains the correct properties", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .then((result) => {
        const user = result.body.user;
        expect(user).toHaveProperty("username", "icellusedkars");
        expect(user).toHaveProperty("name", "sam");
        expect(user).toHaveProperty(
          "avatar_url",
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
        );
      });
  });
  it("GET: 404 should respond with an appropriate status and error message when provided with an non-existent username", () => {
    return request(app)
      .delete("/api/users/coolUsername")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH: /api/comments/:comment_id", () => {
  it("PATCH: 200 should allow a user to increment the votes on a given comment and responds with the updated comment", () => {
    const updatedVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/comments/5")
      .send(updatedVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toHaveProperty("body", "I hate streaming noses");
        expect(comment).toHaveProperty("votes", 10);
        expect(comment).toHaveProperty("author", "icellusedkars");
        expect(comment).toHaveProperty("article_id", 1);
      });
  });
  it("PATCH: 200 should allow a user to decrement the votes on a given comment and responds with the updated comment", () => {
    const updatedVotes = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/comments/5")
      .send(updatedVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toHaveProperty("body", "I hate streaming noses");
        expect(comment).toHaveProperty("votes", -10);
        expect(comment).toHaveProperty("author", "icellusedkars");
        expect(comment).toHaveProperty("article_id", 1);
      });
  });
  it("PATCH: 200 should respond with the comment when no inc_votes is sent with the request", () => {
    const updatedVotes = {};
    return request(app)
      .patch("/api/comments/5")
      .send(updatedVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toHaveProperty("body", "I hate streaming noses");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("author", "icellusedkars");
        expect(comment).toHaveProperty("article_id", 1);
      });
  });
  it("PATCH: 400 should respond with an appropriate status and error message when provided with an invalid comment_id", () => {
    const updatedVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/invalid_id")
      .send(updatedVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  it("PATCH: 404 should respond with an appropriate status and error message when provided with valid but non-existent comment_id", () => {
    const updatedVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/999")
      .send(updatedVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment Not Found");
      });
  });
});

describe("POST: /api/articles", () => {
  it("POST: 201 should allow a user to post a new article", () => {
    const newArticle = {
      body: "This is only a test. No need for alarm. Go about your daily business 👀",
      author: "butter_bridge",
      title: "Just a test.",
      topic: "mitch",
      article_img_url:
        "https://img.buzzfeed.com/buzzfeed-static/static/2018-10/31/10/asset/buzzfeed-prod-web-04/sub-buzz-30364-1540997156-7.jpg?downsize=600:*&output-format=auto&output-quality=auto",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article.body).toBe(newArticle.body);
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Just a test.");
        expect(article.article_id).toBe(14);
        expect(typeof article.created_at).toBe("string");
        expect(article.article_img_url).toBe(newArticle.article_img_url);
      });
  });
  it("POST: 400 should respond with an appropriate status and error message when provided with a bad article request (no body)", () => {
    const newArticle = {
      author: "Anon",
      topic: "mitch",
      article_img_url:
        "https://img.buzzfeed.com/buzzfeed-static/static/2018-10/31/10/asset/buzzfeed-prod-web-04/sub-buzz-30364-1540997156-7.jpg?downsize=600:*&output-format=auto&output-quality=auto",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  it("POST: 404 should respond with an appropriate status and error message when provided with a non-existent topic", () => {
    const newArticle = {
      body: "This is only a test. No need for alarm. Go about your daily business 👀",
      author: "butter_bridge",
      title: "Just a test.",
      topic: "nonsense",
      article_img_url:
        "https://img.buzzfeed.com/buzzfeed-static/static/2018-10/31/10/asset/buzzfeed-prod-web-04/sub-buzz-30364-1540997156-7.jpg?downsize=600:*&output-format=auto&output-quality=auto",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Topic Not Found");
      });
  });
  it("POST: 404 should respond with an appropriate status and error message when provided with a non-existent username", () => {
    const newArticle = {
      body: "This is only a test. No need for alarm. Go about your daily business 👀",
      author: "beefboi",
      title: "Just a test.",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Username Not Found");
      });
  });
});

describe("POST: /api/topics", () => {
  it("POST: 201 should allow a user to post a new topic", () => {
    const newTopic = {
      slug: "nerfs",
      description: "surf n' nerf.",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then((response) => {
        const topic = response.body.topic;
        expect(topic.slug).toBe("nerfs");
        expect(topic.description).toBe("surf n' nerf.");
      });
  });
  it("POST: 400 should respond with an appropriate status and error message when provided with a bad topic request (no slug)", () => {
    const newTopic = {
      description: "surf n' nerf",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE: /api/articles/:article_id", () => {
  it("DELETE: 204 should delete the specified article and respond with the correct status", () => {
    return request(app).delete("/api/articles/2").expect(204);
  });
  it("DELETE: 404 should respond with an appropriate status and error message when provided with valid but non-existent article_id", () => {
    return request(app)
      .delete("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article Not Found");
      });
  });
  it("DELETE: 400 should respond with an appropriate status and error message when provided with an invalid article_id", () => {
    return request(app)
      .delete("/api/articles/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET: /api/articles/search", () => {
  it("GET: 200 should respond with an array of relevant search results", () => {
    return request(app)
      .get("/api/articles/search?q=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.search_results).toBeSortedBy("rank", {
          descending: true,
        });
        body.search_results.forEach((result) => {
          expect(result).toHaveProperty("article_id");
          expect(result).toHaveProperty("title");
          expect(result).toHaveProperty("topic", "mitch");
          expect(result).toHaveProperty("author");
          expect(result).toHaveProperty("rank");
        });
      });
  });
  it("GET: 200 should respond with an empty array if no search results are found", () => {
    return request(app)
      .get("/api/articles/search?q=not+found")
      .expect(200)
      .then(({ body }) => {
        expect(body.search_results).toHaveLength(0);
      });
  });
});

describe("GET: /api/topics/search", () => {
  it("GET: 200 should respond with an array of relevant search results", () => {
    return request(app)
      .get("/api/topics/search?q=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.search_results[0]).toHaveProperty("slug", "mitch");
        expect(body.search_results[0]).toHaveProperty("rank");
      });
  });
  it("GET: 200 should respond with an empty array if no search results are found", () => {
    return request(app)
      .get("/api/topics/search?q=not+found")
      .expect(200)
      .then(({ body }) => {
        expect(body.search_results).toHaveLength(0);
      });
  });
});

describe("GET: /api/users/search", () => {
  it("GET: 200 should respond with an array of relevant search results", () => {
    return request(app)
      .get("/api/users/search?q=butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.search_results[0]).toHaveProperty(
          "username",
          "butter_bridge"
        );
        expect(body.search_results[0]).toHaveProperty("name", "jonny");
        expect(body.search_results[0]).toHaveProperty(
          "avatar_url",
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
  it("GET: 200 should respond with an empty array if no search results are found", () => {
    return request(app)
      .get("/api/topics/search?q=not+found")
      .expect(200)
      .then(({ body }) => {
        expect(body.search_results).toHaveLength(0);
      });
  });
});
