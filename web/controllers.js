const model = require("./reviewsModel.js");
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  port: "6379",
  host: "redis://reviewsCache",
  password: process.env.SDC_REDIS_PASSWORD
});
const getAsync = promisify(client.get).bind(client);
const setexAsync = promisify(client.setex).bind(client);
const delAsync = promisify(client.del).bind(client);

client.on("error", (err) => {
  console.log(err);
});


module.exports = {

  list: (req, res) => {
    const product_id = req.params.product_id;
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const sort = req.query.sort || "relevant";

    model.getList(product_id, page, count, sort)
      .then(({rows}) => {
        for (var row of rows) {
          row.photos = [];
          for (var i = 0; i < row.pids.length; i++) {
            if (row.pids[i] !== null) {
              row.photos[i] = {
                id: row.pids[i],
                url: row.purls[i]
              };
            }
          }
          delete row.product_id;
          delete row.pids;
          delete row.purls;
          delete row.reported;
          delete row.reviewer_email;
        }
        let data = {
          product: product_id,
          page: page,
          count: count,
          results: rows
        };
        res.status(200);
        res.json(data);
      })
      .catch((err) => {
        console.log("Error at get reviews list:", err);
        res.sendStatus(500);
      });
  },

  meta: (req, res) => {
    const product_id = req.params.product_id;

    getAsync(`metadata:${product_id}`)
      .then((result) => {
        if (result) {
          res.status(200);
          res.json(result);
        } else {
          model.getRatings(product_id)
            .then((rData) => {
              const ratings = rData.rows;
              model.getChars(product_id)
                .then((cData) => {
                  const chars = cData.rows;
      
                  let metadata = {
                    product_id: product_id,
                    ratings: {},
                    recommended: {
                      0: 0,
                      1: 0
                    },
                    characteristics: {}
                  };
      
                  let total = 0;
                  for (var starnum of ratings) {
                    metadata.ratings[starnum.rating] = Number(starnum.count);
                    total += Number(starnum.count);
                    metadata.recommended[1] += Number(starnum.sum);
                  }
                  metadata.recommended[0] = total - metadata.recommended[1];
      
                  for (var char of chars) {
                    metadata.characteristics[char.name] = {id: char.id, value: Number(char.avg).toFixed(4)};
                  }
                  setexAsync(`metadata:${product_id}`, 300, metadata);
                  res.status(200);
                  res.json(metadata);
                })
                .catch((err) => {
                  console.log("Error at get characteristics metadata:", err);
                  res.sendStatus(500);
                });
            })
            .catch((err) => {
              console.log("Error at get ratings metadata:", err);
              res.sendStatus(500);
            });
        }
      })

  },

  post: (req, res) => {
    delAsync(`metadata:${req.params.product_id}`);

    model.postReview(req.params.product_id, req.body)
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log("Error at post review:", err);
        res.sendStatus(500);
      });
  },

  helpful: (req, res) => {
    delAsync(`metadata:${req.params.product_id}`);

    model.markHelpful(req.params.review_id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log("Error at mark review helpful:", err);
        res.sendStatus(500);
      });
  },

  report: (req, res) => {
    delAsync(`metadata:${req.params.product_id}`);

    model.report(req.params.review_id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log("Error at report review:", err);
        res.sendStatus(500);
      });
  }

}