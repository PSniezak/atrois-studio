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
  data["showcase"] = false;

  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (!fs.existsSync('./public/uploads/projects/covers')){
      fs.mkdirSync('./public/uploads/projects/covers');
    }

    var fstream;

    if (fieldname == "showcase_cover" && filename.length > 0) {
      fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename);
      file.pipe(fstream);

      data["showcase_cover"] = filename;
      data["showcase_type"] = mimetype;
    } else if (fieldname == "showcase_cover_mobile" && filename.length > 0) {
      fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename);
      file.pipe(fstream);

      data["showcase_cover_mobile"] = filename;
      data["showcase_type_mobile"] = mimetype;
    } else if (fieldname != "showcase_cover" && fieldname != "showcase_cover_mobile" && filename.length > 0) {
      fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename);
      file.pipe(fstream);
      data["cover"] = filename;
    }

    file.resume();
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

    connection.query('SELECT * FROM medias WHERE project_id = ? ORDER BY place ASC', [id], function(err, rows) {
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

  connection.query('SELECT * FROM medias WHERE project_id = ? AND mobile = 0 ORDER BY place ASC', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    res.json({medias:media});
  });
});

/*
 * GET all mobile medias
*/
router.get('/projects/media_mobile/:id/all', function(req, res){
  var id = req.params.id;

  connection.query('SELECT * FROM medias WHERE project_id = ? AND mobile = 1 ORDER BY place ASC', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    res.json({medias:media});
  });
});

/*
 * POST Showcase
*/
router.get('/projects/showcase/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query('UPDATE projects SET showcase = 1 WHERE id = ?', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    req.flash('success', "Le projet est maintenant showcasé.");
    res.redirect('/projects');
  });
});

/*
 * POST Unshowcase
*/
router.get('/projects/unshowcase/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query('UPDATE projects SET showcase = 0 WHERE id = ?', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    req.flash('success', "Le projet a été unshowcasé.");
    res.redirect('/projects');
  });
});

/*
 * POST Activate
*/
router.get('/projects/activate/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query('UPDATE projects SET active = 1 WHERE id = ?', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    req.flash('success', "Le projet est maintenant activé.");
    res.redirect('/projects');
  });
});

/*
 * POST Deactivate
*/
router.get('/projects/deactivate/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query('UPDATE projects SET active = 0 WHERE id = ?', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    req.flash('success', "Le projet a été désactivé.");
    res.redirect('/projects');
  });
});

/*
 * POST Inframe
*/
router.get('/projects/inframe/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query('UPDATE projects SET iframe_active = 1 WHERE id = ?', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    req.flash('success', "Le site est maintenant visible.");
    res.redirect('/projects');
  });
});

/*
 * POST Unframe
*/
router.get('/projects/unframe/:id', requireLogin, function(req, res){
  var id = req.params.id;

  connection.query('UPDATE projects SET iframe_active = 0 WHERE id = ?', [id], function(err, media) {
    if(err)
      req.flash('error', err);

    req.flash('success', "Le site est maintenant caché.");
    res.redirect('/projects');
  });
});

/*
 * POST Media
*/
router.post('/projects/media/:id', requireLogin, function(req, res){
  var id = req.params.id;

  var data = {project_id: id};
  data["mobile"] = false;
  data["place"] = 0;

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
      var query = connection.query("INSERT INTO medias set ? ", data, function(err, rows) {
        if (err)
          req.flash('error', err);
      });
    } else if (fieldname == "media" && filename.length > 0) {
      data["media"] = filename;
      fstream = fs.createWriteStream('./public/uploads/projects/' + id + '/' + filename);
      file.pipe(fstream);
      var query = connection.query("INSERT INTO medias set ? ", data, function(err, rows) {
        if (err)
          req.flash('error', err);
      });
    }

    file.resume();
  });

  req.busboy.on('finish', function() {
    req.flash('success', "Le média a bien été ajouté");
    res.redirect('/projects/media/' + id);
  });
});

/*
 * POST Media mobile
*/
router.post('/projects/media_mobile/:id', requireLogin, function(req, res){
  var id = req.params.id;

  var data = {project_id: id};
  data["mobile"] = true;
  data["place"] = 0;

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
      var query = connection.query("INSERT INTO medias set ? ", data, function(err, rows) {
        if (err)
          req.flash('error', err);
      });
    } else if (fieldname == "media" && filename.length > 0) {
      data["media"] = filename;
      fstream = fs.createWriteStream('./public/uploads/projects/' + id + '/' + filename);
      file.pipe(fstream);
      var query = connection.query("INSERT INTO medias set ? ", data, function(err, rows) {
        if (err)
          req.flash('error', err);
      });
    }

    file.resume();
  });

  req.busboy.on('finish', function() {
    req.flash('success', "Le média a bien été ajouté");
    res.redirect('/projects/media/' + id);
  });
});

/*
 * UPDATE Media place
*/
router.post('/projects/media/:project/place/:media', requireLogin, function(req, res){
  var media = req.params.media;
  var project = req.params.project;
  var data = {};

  req.pipe(req.busboy);

  req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    data[fieldname] = val;
  });

  req.busboy.on('finish', function() {
    connection.query("UPDATE medias SET ? WHERE id = ? ", [data, media], function(err, rows) {
      if(err)
        req.flash('error', err);

      req.flash('success', "Le média a bien été mis à jour");
      res.redirect('/projects/media/' + project);
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
  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var test = "a" + filename + "a";
    var fstream;

    if (filename.length > 0) {
      if (fieldname == "showcase_cover") {
        fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename);
        file.pipe(fstream);

        data["showcase_cover"] = filename;
        data["showcase_type"] = mimetype;
      } else if (fieldname == "showcase_cover_mobile") {
        fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename);
        file.pipe(fstream);

        data["showcase_cover_mobile"] = filename;
        data["showcase_type_mobile"] = mimetype;
      } else if (fieldname != "showcase_cover" && fieldname != "showcase_cover_mobile") {
        fstream = fs.createWriteStream('./public/uploads/projects/covers/' + filename);
        file.pipe(fstream);
        data["cover"] = filename;
      }
    } else {
      if (data["cover"] == '') {
        delete data['cover'];
      } else if (data["showcase_cover"] == '') {
        delete data['showcase_cover'];
      } else if (data["showcase_cover_mobile"] == '') {
        delete data['showcase_cover_mobile'];
      }
    }

    file.resume();
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
