var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Atrois Studio' });
});
router.get('/en', function(req, res, next) {
  res.render('index-en', { title: 'Atrois Studio' });
});
router.get('/cn', function(req, res, next) {
  res.render('index-cn', { title: 'Atrois Studio' });
});
router.get('/jp', function(req, res, next) {
  res.render('index-jp', { title: 'Atrois Studio' });
});

module.exports = router;
