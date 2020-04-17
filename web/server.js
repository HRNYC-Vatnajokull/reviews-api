const express = require("express");
const parser = require("body-parser");
const morgan = require("morgan");
const router = require("./routes.js");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(parser.json());
app.use(morgan("dev"));

app.use(cors());

app.use("/reviews", router);

app.listen(port, () => console.log(`API server listening on port ${port}...`));