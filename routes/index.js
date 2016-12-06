var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'eu-cdbr-west-01.cleardb.com',
  user: 'b4883f2ddaa320',
  password: '4ec0e84f',
  database: 'heroku_261b3e78d7568f1'
});


/*
 * GET Home FR
*/
router.get('/', function(req, res, next) {
  connection.query('SELECT DISTINCT year FROM projects ORDER BY year ASC', function(err, years) {
    if(err)
      req.flash('error', err);

    connection.query('SELECT * FROM projects ORDER BY year ASC', function(err, projects) {
      if(err)
        req.flash('error', err);

      connection.query('SELECT * FROM publications ORDER BY award ASC', function(err, publications) {
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
  res.render('index-en', { title: 'Atrois Studio' });
});

/*
 * GET Home KOR
*/
router.get('/kor', function(req, res, next) {
  res.render('index-kor', { title: 'Atrois Studio' });
});

/*
 * GET Home JP
*/
router.get('/jp', function(req, res, next) {
  res.render('index-jp', { title: 'Atrois Studio' });
});

 module.exports = router;
