const model = require("./reviewsModel.js");


module.exports = {

  list: (req, res) => {
    const product_id = req.params.product_id;
    const page = req.body.page || 1;
    const count = req.body.count || 5;
    const sort = req.body.sort || "relevant";

    model.getList(product_id, page, count, sort)
      .then(({rows}) => {
        for (var row of rows) {
          row.photos = [];
          for (var i = 0; i < row.pids.length; i++) {
            row.photos[i] = {
              id: row.pids[i],
              url: row.purls[i]
            };
          }
          delete row.pids;
          delete row.purls;
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
    model.getRatings(product_id)
      .then(({rows}) => {
        const ratings = rows;
        model.getChars(product_id)
          .then(({rows2}) => {
            const chars = rows2;

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
              metadata.ratings[starnum.rating] = starnum.count;
              total += starnum.count;
              metadata.recommended[1] += starnum.sum;
            }
            metadata.recommended[0] = total - metadata.recommended[1];

            for (var char of chars) {
              metadata.characteristics[char.name] = {id: char.id, value: char.avg};
            }

            res.status(200);
            res.json(metadata);
          })
          .catch((err) => {
            console.log("Error at get characteristics metadata", err);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.log("Error at get ratings metadata:", err);
        res.sendStatus(500);
      });
  }

}