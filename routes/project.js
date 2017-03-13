var express = require('express');
var router = express.Router();
var fs = require("fs");
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'paulsniezak123.',
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
    if (fieldname == "description" || fieldname == "description_en" || fieldname == "description_jp" || fieldname == "description_kor") {
      data[fieldname] = val.replace(/\r\n|\r|\n/g,"<br />");
    } else {
      data[fieldname] = val;
    }
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
 * GET Medias
*/
router.get('/projects/media/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query('SELECT * FROM projects WHERE id = ?', [id], function(err, project) {
    if(err)
      req.flash('error', err);

    connection.query('SELECT * FROM medias WHERE project_id = ?', [id], function(err, rows) {
      if(err)
        req.flash('error', err);

      res.render('projects/media_project', {project:project, data:rows});
    });
  });
});

/*
 * GET all medias
*/
router.get('/projects/media/:id/all', function(req, res){
  var id = req.params.id;

  connection.query('SELECT * FROM medias WHERE project_id = ?', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    res.json({medias:media});
  });
});

/*
 * POST Media
*/
router.post('/projects/media/:id', requireLogin, function(req, res){
  var id = req.params.id;

  var data = {project_id: id};

  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    if (!fs.existsSync('./public/uploads/projects/' + id + '/')){
        fs.mkdirSync('./public/uploads/projects/' + id + '/');
    }

    var fstream;

    if (fieldname == "video" && filename.length > 0) {
      data["video"] = filename;
      fstream = fs.createWriteStream('./public/uploads/projects/' + id + '/' + filename);
      file.pipe(fstream);
    } else if (fieldname == "media" && filename.length > 0) {
      data["media"] = filename;
      fstream = fs.createWriteStream('./public/uploads/projects/' + id + '/' + filename);
      file.pipe(fstream);
    }

    file.resume();
  });

  req.busboy.on('finish', function() {
    var query = connection.query("INSERT INTO medias set ? ", data, function(err, rows) {
      if (err)
        req.flash('error', err);

      req.flash('success', "Le média a bien été ajouté");
      res.redirect('/projects/media/' + id);
    });
  });
});

/*
 * DELETE Media
*/
router.get('/projects/media/:project/delete/:media', requireLogin, function(req, res){
  var media = req.params.media;
  var project = req.params.project;

  connection.query("DELETE FROM medias WHERE id = ? ", [media], function(err, rows) {
    if(err)
      req.flash('error', err);

    req.flash('success', "Le média a bien été supprimé");
    res.redirect('/projects/media/' + project);
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

    if (test != "aa") {
      var fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename);
      file.pipe(fstream);
      data["cover"] = filename;
    } else {
      if (data["cover"] == '') {
        delete data['cover'];
      }
      file.resume();
    }
  });

  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    if (fieldname == "description" || fieldname == "description_en" || fieldname == "description_jp" || fieldname == "description_kor") {
      data[fieldname] = val.replace(/\r\n|\r|\n/g,"<br />");
    } else {
      data[fieldname] = val;
    }
  });

  req.busboy.on('finish', function() {
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
