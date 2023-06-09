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
var photoRouter = require('./routes/photo');
var checkoutRouter = require('./routes/checkout');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(cors());
// app.use(
//   cors({
//     origin: [
//       'https://main--rococo-semifreddo-f6db94.netlify.app',
//       'http://localhost:3000',
//     ],
//   })
// );
// app.use(
//   cors({
//     origin: ['http://localhost:3000', 'http://192.168.1.174:3000'],
//   })
// );

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/store', storeRouter);
app.use('/item', itemRouter);
app.use('/comment', commentRouter);
app.use('/photo', photoRouter);
app.use('/checkout', checkoutRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}" `
    );
  })
  .catch((err) => console.log(err));

module.exports = app;
