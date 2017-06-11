const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const routes = require('./core/routes.js');

dotenv.load();

const app = express();

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'build')));

app.set('views', __dirname);
app.set('view engine', 'pug');

routes(app);

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Magic happens on port ${port}`);  // eslint-disable-line

module.exports = app;
