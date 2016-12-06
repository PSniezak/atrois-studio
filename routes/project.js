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
 * GET Project list
*/
router.get('/projects', requireLogin, function(req, res) {
  connection.query('SELECT * FROM projects', function(err, rows) {
    if(err)
      req.flash('error', err);

    res.render('projects/project', {data: rows, successMessages: req.flash()['success'], errorMessages: req.flash()['error']});
  });
});

/*
 * GET Project new
*/
router.get('/projects/add', requireLogin, function(req, res){
  res.render('projects/add_project');
});

/*
 * POST Project add
*/
router.post('/projects/add', requireLogin, function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));

  var data = {
    year    : input.year,
    client : input.client,
    name   : input.name,
    categories   : input.categories,
    season : input.season,
    url: input.url,
    description: input.description,
    place: input.place
  };

  var query = connection.query("INSERT INTO projects set ? ", data, function(err, rows) {
    if (err)
      req.flash('error', err);

    req.flash('success', "Le projet a bien été ajouté");
    res.redirect('/projects');
  });
});

/*
 * GET Project edit
*/
router.get('/projects/edit/:id', requireLogin, function(req, res){
  var id = req.params.id;
  
  connection.query('SELECT * FROM projects WHERE id = ?', [id], function(err, rows) {
    if(err)
      req.flash('error', err);

    res.render('projects/edit_project', {data:rows});
  });
});

/*
 * POST Project edit
*/
router.post('/projects/edit/:id', requireLogin, function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));
  var id = req.params.id;

  var data = {
    year    : input.year,
    client : input.client,
    name   : input.name,
    categories   : input.categories,
    season : input.season,
    url: input.url,
    description: input.description,
    place: input.place
  };

  connection.query("UPDATE projects set ? WHERE id = ? ", [data, id], function(err, rows) {
    if (err)
      req.flash('error', err);

    req.flash('success', "Le projet a bien été édité");
    res.redirect('/projects');
  });
});

/*
 * DELETE Project 
*/
router.get('/projects/delete/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query("DELETE FROM projects WHERE id = ? ", [id], function(err, rows) {
    if(err)
      req.flash('error', err);

    req.flash('success', "Le projet a bien été supprimé");
    res.redirect('/projects');
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