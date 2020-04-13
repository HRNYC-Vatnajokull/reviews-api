const express = require("express");

const router = express.Router();


router.get("/reviews/:product_id/list", xyz);
router.get("/reviews/:product_id/meta", xyz);
router.post("/reviews/:product_id", xyz);
router.put("/reviews/helpful/:review_id", xyz);
router.put("/reviews/report/:review_id", xyz);

module.exports = router;