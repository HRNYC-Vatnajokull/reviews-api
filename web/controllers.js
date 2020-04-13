const model = require("./reviewsModel.js");


module.exports = {

  list: (req, res) => {
    model.getList(req.params.product_id, req.body.page, req.body.count, req.body.sort)
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
          product: req.params.product_id,
          page: req.body.page,
          count: req.body.count,
          results: rows
        };
        res.status(200);
        res.json(data);
      })
      .catch((err) => {
        console.log("Error at get reviews list:", err);
        res.sendStatus(500);
      });
  }
  
}