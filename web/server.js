const express = require("express");
const parser = require("body-parser");
const morgan = require("morgan");
const router = require("./routes.js");

const app = express();
const port = 3000;

app.use(parser.json());
app.use(morgan("dev"));

app.use("/reviews", router);

app.listen(port, () => console.log(`API server listening on port ${port}...`));