var express = require('express');
var router = express.Router();

/*
 * GET Login
*/
router.get('/login', function(req, res){
  res.render('login');
});

/*
 * POST Login
*/
router.post('/login/pending', function(req, res){
  if (req.body.username == "atrois" && req.body.password == "aze123.") {
    req.session.admin = true;
    res.redirect('/projects');
  } else {
    res.redirect('/');
  }
});

/*
 * GET Logout
*/
router.get('/logout',function(req, res){
  req.session.destroy(function(err) {
    if(err) {
      res.render('error', { message: 'Erreur', error: {status: 'Déconnexion', stack: err}});
    } else {
      res.redirect('/');
    }
  });
});

router.get('/admin', requireLogin, function(req, res){
  res.redirect('/projects');
});


module.exports = router;


function requireLogin(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/login");
  }
}
