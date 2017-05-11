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
 * GET Publication list
*/
router.get('/publications', requireLogin, function(req, res) {
  connection.query('SELECT * FROM publications', function(err, rows) {
    if(err)
      req.flash('error', err);

    res.render('publications/publication', {data: rows, successMessages: req.flash()['success'], errorMessages: req.flash()['error']});
  });
});

/*
 * GET Publication new
*/
router.get('/publications/add', requireLogin, function(req, res){
  res.render('publications/add_publication');
});

/*
 * POST Publication add
*/
router.post('/publications/add', requireLogin, function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));

  var data = {
    season: input.season,
    season_en: input.season_en,
    season_jp: input.season_jp,
    season_kor: input.season_kor,
    title: input.title,
    title_en: input.title_en,
    title_jp: input.title_jp,
    title_kor: input.title_kor,
    client: input.client,
    client_en: input.client_en,
    client_jp: input.client_jp,
    client_kor: input.client_kor,
    url: input.url,
    award: input.award,
    place: input.place
  };

  if (data.award == "on") {
    data.award = true;
  } else {
    data.award = false;
  }

  var query = connection.query("INSERT INTO publications set ? ", data, function(err, rows) {
    if (err)
      req.flash('error', err);

    req.flash('success', "La publication a bien été ajoutée");
    res.redirect('/publications');
  });
});

/*
 * GET Publication edit
*/
router.get('/publications/edit/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query('SELECT * FROM publications WHERE id = ?', [id], function(err, rows) {
    if(err)
      req.flash('error', err);

    res.render('publications/edit_publication', {data:rows});
  });
});

/*
 * POST Publication edit
*/
router.post('/publications/edit/:id', requireLogin, function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));
  var id = req.params.id;

  var data = {
    season: input.season,
    season_en: input.season_en,
    season_jp: input.season_jp,
    season_kor: input.season_kor,
    title: input.title,
    title_en: input.title_en,
    title_jp: input.title_jp,
    title_kor: input.title_kor,
    client: input.client,
    client_en: input.client_en,
    client_jp: input.client_jp,
    client_kor: input.client_kor,
    url: input.url,
    award: input.award,
    place: input.place
  };

  if (data.award == "on") {
    data.award = true;
  } else {
    data.award = false;
  }

  connection.query("UPDATE publications set ? WHERE id = ? ", [data, id], function(err, rows) {
    if (err)
      req.flash('error', err);

    req.flash('success', "La publication a bien été éditée");
    res.redirect('/publications');
  });
});

/*
 * DELETE Publication
*/
router.get('/publications/delete/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query("DELETE FROM publications WHERE id = ? ", [id], function(err, rows) {
    if(err)
      req.flash('error', err);

    req.flash('success', "La publication a bien été supprimée");
    res.redirect('/publications');
  });
});

module.exports = router;

function requireLogin(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/login");
  }
}
