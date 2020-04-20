const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.SDC_PG_USER,
  host: "172.31.46.114",
  database: "reviewsDB",
  password: process.env.SDC_PG_PASSWORD,
  port: 5432
});

module.exports = {
  query: (text, params, cb) => {
    return pool.query(text, params, cb);
  }
};