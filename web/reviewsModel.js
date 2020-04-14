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
    return db.query(`SELECT r.id AS review_id, r.product_id, r.rating, r.date, r.summary, r.body, r.recommend, \
    r.reviewer_name, r.reviewer_email, r.response, r.helpfulness, array_agg(p.id) as pids, array_agg(p.url) as purls \
    FROM reviews r \
    LEFT JOIN reviews_photos p \
    ON r.id = p.review_id \
    WHERE r.product_id = $1 AND r.reported != 1 \
    GROUP BY r.id \
    ORDER BY ${order} \
    LIMIT $2 \
    OFFSET $3`, [product_id, count, offset]);
  },

  getRatings: (product_id) => {
    return db.query("SELECT r.rating, COUNT(r.rating), sum(r.recommend) \
    FROM reviews r \
    WHERE r.product_id = $1 \
    GROUP BY r.rating", [product_id]);
  },

  getChars: (product_id) => {
    return db.query("SELECT c.name, c.id, avg(cr.value) \
    FROM characteristics c \
    LEFT JOIN characteristics_reviews cr \
    ON c.id = cr.characteristic_id \
    WHERE c.product_id = $1 \
    GROUP BY c.id", [product_id]);
  },

  postReview: (product_id, body) => {
    return db.query("INSERT INTO reviews (rating, product_id, body, summary, recommend, reviewer_name, reviewer_email, reported, helpfulness \
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0", [body.rating, product_id, body.body, body.summary, body.recommend, body.name, body.email])
      .then(() => {
        return db.query("SELECT max(r.id) FROM reviews r")
          .then(({rows}) => {
            const insertedReviewId = rows[0].max;
            if (body.photos && body.photos.length > 0) {
              for (var i = 0; i < body.photos.length; i++) {
                db.query("INSERT INTO reviews_photos (review_id, url) VALUES ($1, $2)", [insertedReviewId, body.photos[i]]);
              }
            }
            for (var charId in body.characteristics) {
              db.query("INSERT INTO characteristics_reviews (characteristic_id, review_id, value) \
              VALUES ($1, $2, $3)", [charId, insertedReviewId, body.characteristics[charId]]);
            }
          });
      });
  },

  markHelpful: (review_id) => {
    console.log("review_id is,", review_id);
    return db.query("UPDATE reviews SET helpfulness = helpfulness + 1 \
    WHERE id = $1", [review_id]);
  },

  report: (review_id) => {
    return db.query("UPDATE reviews SET reported = 1 \
    WHERE id = $1", [review_id]);
  }

}