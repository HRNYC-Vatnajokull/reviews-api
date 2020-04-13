const { Pool } = require("pg");

const pool = new Pool({
  user: mayanne,
  host: localhost,
  database: mayanne,
  password: hrpassword,
  port: 5431
});

module.exports = {
  query: (text, params, cb) => {
    return pool.query(text, params, cb);
  }
};