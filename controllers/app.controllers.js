const { fetchTopics, fetchArticleById } = require("../models/app.models");
const endpoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
};

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((articles) => res.status(200).send({ articles }))
    .catch((err) => {
      next(err);
    });
};
