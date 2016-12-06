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

  console.log(input);

  var data = {
    season: input.season,
    title: input.title,
    client: input.client,
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
    title: input.title,
    client: input.client,
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