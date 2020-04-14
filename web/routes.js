const express = require("express");
const controllers = require("./controllers.js");

const router = express.Router();


router.get("/:product_id/list", controllers.list);
router.get("/:product_id/meta", controllers.meta);
router.post("/:product_id", controllers.post);
router.put("/helpful/:review_id", controllers.helpful);
router.put("/report/:review_id", controllers.report);

module.exports = router;