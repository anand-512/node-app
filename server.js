var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var passport = require('passport');
var http = require('http');
var socket = require('socket.io');

// Load environment variables from .env file
dotenv.load();


// Passport OAuth strategies
require('./config/passport');

var app = express();

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.siteName = process.env.SITE_NAME;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

require('./config/routes')(app, passport);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

var server = http.createServer(app);
var io = socket(server);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

require('./config/io')(io);

module.exports = app;
