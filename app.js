var express       = require('express'),
    path          = require('path'),
    favicon       = require('serve-favicon'),
    logger        = require('morgan'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    session       = require('express-session'),
    flash         = require('connect-flash'),
    busboy        = require("connect-busboy"),
    robots        = require("express-robots"),
    sitemap       = require('express-sitemap'),
    device        = require('express-device'),
    compression   = require('compression');

// MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'paulsniezak123.',
  database: 'atrois-studio'
});

var index = require('./routes/index');
var admin = require('./routes/admin');
var project = require('./routes/project');
var publication = require('./routes/publication');

var app = express();

// GZIP compression
app.use(compression());

// Sitemap
sitemap({
  map: {
    '/': ['get'],
    '/en': ['get'],
    '/jp': ['get'],
    '/kor': ['get'],
    '/admin': ['post']
  },
  route: {
    '/': {
      lastmod: '2014-06-20',
      changefreq: 'always',
      priority: 1.0,
    },
    '/admin': {
      disallow: true,
    },
  },
}).XMLtoFile();

// Robots.txt
app.use(robots(__dirname + '/robots.txt'));

// Session
app.use(session({
  secret: 'atrois123.',
  resave: true,
  saveUninitialized: true
}));

// Device
app.use(device.capture());
device.enableDeviceHelpers(app);

app.use(flash());

// Engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboy());
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
