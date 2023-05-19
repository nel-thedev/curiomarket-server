var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var storeRouter = require('./routes/store');
var itemRouter = require('./routes/item');
var commentRouter = require('./routes/comment');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(
  cors({
    origin: ['http://localhost:4000'],
  })
);

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/store', storeRouter);
app.use('/item', itemRouter);
app.use('/comment', commentRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}" `
    );
  })
  .catch((err) => console.log(err));

module.exports = app;
