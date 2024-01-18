const fs = require("fs/promises");
const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Article Not Found", status: 404 });
      }
      return rows;
    });
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "DESC",
  query,
  topic
) => {
  const validQueries = [
    "topic",
    "title",
    "author",
    "created_at",
    "DESC",
    "ASC",
  ];

  if (
    (query && !validQueries.includes(query)) ||
    !validQueries.includes(sort_by) ||
    !validQueries.includes(order)
  ) {
    return Promise.reject({ msg: "Bad Request", status: 400 });
  }

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;
  const queryParameters = [];
  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryParameters.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order}`;

  return db.query(queryStr, queryParameters).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComments = (newComment, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [newComment.username, newComment.body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleVotes = (newVotes, article_id) => {
  if (!newVotes.inc_votes) {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return db
      .query(
        `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,
        [newVotes.inc_votes, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};

exports.removeComments = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ msg: "Comment Not Found", status: 404 });
      }
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateCommentVotes = (comment_id, newVotes) => {
  if (!newVotes.inc_votes) {
    return db
      .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return db
      .query(
        `UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *`,
        [newVotes.inc_votes, comment_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
};

exports.insertArticles = (newArticle) => {
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [
        newArticle.author,
        newArticle.title,
        newArticle.body,
        newArticle.topic,
        newArticle.article_img_url,
      ]
    )
    .then(({ rows }) => {
      console.log(rows[0]);
      return rows[0];
    });
};
