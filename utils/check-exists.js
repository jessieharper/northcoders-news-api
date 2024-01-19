const db = require("../db/connection");
const format = require("pg-format");

exports.checkExists = (table, column, value) => {
  const queryStr = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  return db.query(queryStr, [value]).then(({ rows }) => {
    const missingValue = table.slice(0, 1).toUpperCase() + table.slice(1, -1);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: `${missingValue} Not Found` });
    }
  });
};
