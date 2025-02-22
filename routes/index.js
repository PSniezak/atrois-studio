var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'paulsniezak123.',
  database: 'atrois-studio'
});

/*
 * GET Home FR
*/
router.get('/', function(req, res, next) {
  connection.query('SELECT DISTINCT year FROM projects ORDER BY year DESC', function(err, years) {
    if(err)
      req.flash('error', err);

    connection.query('SELECT * FROM projects ORDER BY year DESC, id DESC', function(err, projects) {
      if(err)
        req.flash('error', err);

      connection.query('SELECT * FROM publications ORDER BY award ASC, id DESC', function(err, publications) {
        if(err)
          req.flash('error', err);

        res.render('index', { title: 'Atrois Studio', projects: projects, years: years, publications: publications});
      });
    });
  });
});

/*
 * GET Home EN
*/
router.get('/en', function(req, res, next) {
  connection.query('SELECT DISTINCT year FROM projects ORDER BY year DESC', function(err, years) {
    if(err)
      req.flash('error', err);

    connection.query('SELECT * FROM projects ORDER BY year DESC, id DESC', function(err, projects) {
      if(err)
        req.flash('error', err);

      connection.query('SELECT * FROM publications ORDER BY award ASC, id DESC', function(err, publications) {
        if(err)
          req.flash('error', err);

        res.render('index-en', { title: 'Atrois Studio', projects: projects, years: years, publications: publications});
      });
    });
  });
});

/*
 * GET Home KOR
*/
router.get('/kor', function(req, res, next) {
  connection.query('SELECT DISTINCT year FROM projects ORDER BY year DESC', function(err, years) {
    if(err)
      req.flash('error', err);

    connection.query('SELECT * FROM projects ORDER BY year DESC, id DESC', function(err, projects) {
      if(err)
        req.flash('error', err);

      connection.query('SELECT * FROM publications ORDER BY award ASC, id DESC', function(err, publications) {
        if(err)
          req.flash('error', err);

        res.render('index-kor', { title: 'Atrois Studio', projects: projects, years: years, publications: publications});
      });
    });
  });
});

/*
 * GET Home JP
*/
router.get('/jp', function(req, res, next) {
  connection.query('SELECT DISTINCT year FROM projects ORDER BY year DESC', function(err, years) {
    if(err)
      req.flash('error', err);

    connection.query('SELECT * FROM projects ORDER BY year DESC, id DESC', function(err, projects) {
      if(err)
        req.flash('error', err);

      connection.query('SELECT * FROM publications ORDER BY award ASC, id DESC', function(err, publications) {
        if(err)
          req.flash('error', err);

        res.render('index-jp', { title: 'Atrois Studio', projects: projects, years: years, publications: publications});
      });
    });
  });
});

 module.exports = router;
