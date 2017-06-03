const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./routes');
const hoganExpress = require('hogan-express');

dotenv.load();

const app = express();

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'mustache');
app.enable('view cache');
app.engine('mustache', hoganExpress);

routes(app);

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Magic happens on port ${port}`);  // eslint-disable-line

module.exports = app;
