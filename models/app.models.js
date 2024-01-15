const fs = require("fs/promises");
const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ msg: "Article does not exist", status: 404 });
      }
      return article.rows;
    });
};
