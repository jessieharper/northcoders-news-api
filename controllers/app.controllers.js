const { fetchTopics } = require("../models/app.models");
const endpoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
};

exports.getApi = (req, res, next) => {
  console.log(endpoints);
  res.status(200).send({ endpoints });
};
