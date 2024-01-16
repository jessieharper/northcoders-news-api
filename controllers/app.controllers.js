const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsById,
  insertComments,
  updateVotes,
  removeComments,
} = require("../models/app.models");

const endpoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
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

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => res.status(200).send({ articles }))
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  const articleExistenceQuery = fetchArticleById(article_id);
  const fetchQuery = fetchCommentsById(article_id);

  Promise.all([articleExistenceQuery, fetchQuery])
    .then((response) => {
      const comments = response[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  const articleExistenceQuery = fetchArticleById(article_id);
  const insertQuery = insertComments(newComment, article_id);

  Promise.all([articleExistenceQuery, insertQuery])
    .then((response) => {
      const comment = response[1];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const newVotes = req.body;

  const articleExistenceQuery = fetchArticleById(article_id);
  const updateQuery = updateVotes(newVotes, article_id);
  Promise.all([articleExistenceQuery, updateQuery])
    .then((response) => {
      const comment = response[1];
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  removeComments(comment_id)
    .then((response) => {
      res.status(204).send({ response });
    })
    .catch((err) => {
      next(err);
    });
};
