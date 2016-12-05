var express       = require('express'),
    path          = require('path'),
    favicon       = require('serve-favicon'),
    logger        = require('morgan'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    session       = require('express-session'),
    flash         = require('connect-flash');

// MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'atrois-studio'
});

var index = require('./routes/index');
var admin = require('./routes/admin');
var project = require('./routes/project');
var publication = require('./routes/publication');

var app = express();

// Session
app.use(session({
  secret: 'atrois123.',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  outputStyle: 'compressed',
  debug: true
}));

// Routes
app.use('/', index);
app.use('/', admin);
app.use('/', project);
app.use('/', publication);
app.use('/en', index);
app.use('/fr', index);

app.use(express.static(path.join(__dirname, 'public')));

// 404 error
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;