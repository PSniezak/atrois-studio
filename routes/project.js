var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'atrois-studio'
});

/*
 * GET Project list
*/
router.get('/projects', requireLogin, function(req, res) {
  connection.query('SELECT * FROM projects', function(err, rows) {
    if(err)
      console.log("Error Selecting : %s", err);

    res.render('project', {data: rows});
  });
});

/*
 * GET Project new
*/
router.get('/projects/add', requireLogin, function(req, res){
  res.render('add_project',{page_title:"Add Projects-Node.js"});
});

/*
 * GET Project single edit
*/
router.get('/projects/edit/:id', requireLogin, function(req, res){
  var id = req.params.id;
  req.getConnection(function(err,connection){
    connection.query('SELECT * FROM projects WHERE id = ?', [id], function(err, rows) {
      if(err)
        console.log("Error Selecting : %s ", err);

      res.render('edit_project', {data:rows});
    });
  }); 
});

/*
 * POST Project add
*/
router.post('/projects/add', requireLogin, function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function (err, connection) {
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
        console.log("Error inserting : %s ",err);

      res.redirect('/projects');
    });
  });
});

/*
 * POST Project edit
*/
router.post('/projects/edit/:id', requireLogin, function(req, res){

  var input = JSON.parse(JSON.stringify(req.body));
  var id = req.params.id;

  req.getConnection(function (err, connection) {
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

    connection.query("UPDATE projects set ? WHERE id = ? ", [data,id], function(err, rows) {
      if (err)
        console.log("Error Updating : %s ", err);

      res.redirect('/projects');
    });
  });
});

/*
 * DELETE Project 
*/
router.get('/projects/delete/:id', requireLogin, function(req, res){
   var id = req.params.id;

   req.getConnection(function (err, connection) {
    connection.query("DELETE FROM projects WHERE id = ? ", [id], function(err, rows) {
      if(err)
       console.log("Error deleting : %s ",err );

      res.redirect('/projects');
    });
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