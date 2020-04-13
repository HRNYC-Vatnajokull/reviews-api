const db = require("../db-setup");


module.exports = {

  getList: (product_id, page, count, sort) => {
    const offset = (page - 1) * count;
    let order;
    if (sort === "relevant") {
      order = "r.helpfulness DESC, r.date DESC";
    } else if (sort === "helpful") {
      order = "r.helpfulness DESC";
    } else if (sort === "newest") {
      order = "r.date DESC";
    }
    return db.query(`SELECT r.id, r.product_id, r.rating, r.date, r.summary, r.body, r.recommend, \
    r.reviewer_name, r.reviewer_email, r.response, r.helpfulness, array_agg(p.id) as pids, array_agg(p.url) as purls \
    FROM reviews r \
    LEFT JOIN reviews_photos p \
    ON r.id = p.review_id \
    WHERE r.product_id = ${product_id} \
    GROUP BY r.id \
    LIMIT ${count} \
    OFFSET ${offset} \
    ORDER BY ${order}`);
  },

  getRatings: (product_id) => {
    return db.query(`SELECT r.rating, COUNT(r.rating), sum(r.recommend) \
    FROM reviews r \
    WHERE r.product_id = ${product_id} \
    GROUP BY r.rating`);
  },

  getChars: (product_id) => {
    return db.query(`SELECT c.name, c.id, avg(cr.value) \
    FROM characteristics c \
    LEFT JOIN characteristics_reviews cr \
    WHERE c.product_id = ${product_id} \
    GROUP BY c.id`);
  }

}