var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const router = require("./routes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

app.use(express.static("public")); // static assets eg css, images, js
app.use("/wa", router);

app.listen(port);
console.log("Magic happens on port " + port);
