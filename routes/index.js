var express = require('express');
var router = express.Router();

/*
 * GET Home FR
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Atrois Studio' });
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
