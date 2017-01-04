var express = require('express');
var router = express.Router();
var fs = require("fs");
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'atrois-studio'
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

  var data = {};

  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    if (!fs.existsSync('./public/uploads/projects/covers/')){
        fs.mkdirSync('./public/uploads/projects/covers/');
    }
    var fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename); 
    file.pipe(fstream);
    data["cover"] = filename;
  });

  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    data[fieldname] = val;
  });

  req.busboy.on('finish', function() {
    var query = connection.query("INSERT INTO projects set ? ", data, function(err, rows) {
      if (err)
        req.flash('error', err);

      req.flash('success', "Le projet a bien été ajouté");
      res.redirect('/projects');
    });
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

  var id = req.params.id;
  var data = {};

  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    var test = "a" + filename + "a";
    console.log('1');

    if (test != "aa") {
      console.log('2');
      var fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename); 
      file.pipe(fstream);
      data["cover"] = filename;
    } else {
      if (data["cover"] == '') {
        delete data['cover'];
      }
      file.resume();
    }
    console.log('3');
  });

  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    data[fieldname] = val;
  });

  req.busboy.on('finish', function() {
    console.log(data);
    connection.query("UPDATE projects set ? WHERE id = ? ", [data, id], function(err, rows) {
      if (err)
        req.flash('error', err);

      req.flash('success', "Le projet a bien été édité");
      res.redirect('/projects');
    });
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