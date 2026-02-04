var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var {simpleproxy} = require("./middleware/middleware");

var contentrouter = require("./routes/content");
var apirouter = require("./routes/api");

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(simpleproxy);

app.use("/", contentrouter);
app.use("/", apirouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {errcode: err.status || 500, error: err.message});
});

module.exports = app;