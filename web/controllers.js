
module.exports = {

  list: (req, res) => {
    model.getList(req.params.product_id, req.body.page, req.body.count, req.body.sort)
      .then((list) => {
        
      })
  }
}