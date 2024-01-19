const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsById,
  addComments,
  updateArticleVotes,
  removeComments,
  fetchUsers,
  fetchUserByUsername,
  updateCommentVotes,
  addArticles,
  addTopics,
  removeArticles,
} = require("../models/app.models");

const endpoints = require("../endpoints.json");
const { checkExists } = require("../utils/check-exists");

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
  const { sort_by, order, limit, p, topic } = req.query;
  const queryKey = Object.keys(req.query)[0];
  let query;

  if (
    queryKey !== "sort_by" &&
    queryKey !== "order" &&
    queryKey !== "limit" &&
    queryKey !== "p"
  ) {
    query = queryKey;
  }

  const fetchArticlesQuery = fetchArticles(
    sort_by,
    order,
    limit,
    p,
    query,
    topic
  );
  let queries = [fetchArticlesQuery];

  if (topic) {
    queries.push(checkExists("topics", "slug", topic));
  }

  Promise.all(queries)
    .then((response) => {
      const articles = response[0];
      res.status(200).send({ articles });
    })
    .catch((err) => {
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
  const insertQuery = addComments(newComment, article_id);

  Promise.all([articleExistenceQuery, insertQuery])
    .then((response) => {
      const comment = response[1];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const newVotes = req.body;

  const articleExistenceQuery = fetchArticleById(article_id);
  const updateQuery = updateArticleVotes(newVotes, article_id);
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
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  const checkUserExists = checkExists("users", "username", username);
  const fetchUserQuery = fetchUserByUsername(username);
  const queries = [checkUserExists, fetchUserQuery];

  Promise.all(queries)
    .then((response) => {
      const user = response[1];
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const newVotes = req.body;
  const checkCommentExists = checkExists("comments", "comment_id", comment_id);
  const updateCommentQuery = updateCommentVotes(comment_id, newVotes);
  const queries = [checkCommentExists, updateCommentQuery];

  Promise.all(queries)
    .then((response) => {
      const comment = response[1];
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticles = (req, res, next) => {
  const newArticle = req.body;
  const checkTopicExists = checkExists("topics", "slug", newArticle.topic);

  const insertArticleQuery = addArticles(newArticle);
  const queries = [checkTopicExists, insertArticleQuery];

  Promise.all(queries)
    .then((response) => {
      const article = response[1];
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopics = (req, res, next) => {
  const newTopic = req.body;

  addTopics(newTopic)
    .then((response) => {
      const topic = response;
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticles = (req, res, next) => {
  const { article_id } = req.params;

  removeArticles(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
