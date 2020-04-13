const express = require("express");
const controllers = require("./controllers.js");

const router = express.Router();


router.get("/reviews/:product_id/list", controllers.list);
router.get("/reviews/:product_id/meta", controllers.meta);
router.post("/reviews/:product_id", xyz);
router.put("/reviews/helpful/:review_id", xyz);
router.put("/reviews/report/:review_id", xyz);

module.exports = router;