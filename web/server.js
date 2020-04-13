const express = require("express");
const parser = require("body-parser");
const morgan = require("morgan");

const app = express();
const port = 3000;

app.use(parser.json());
app.use(morgan("dev"));