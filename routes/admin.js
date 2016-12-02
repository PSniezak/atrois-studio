var express = require('express');
var router = express.Router();

/*router.get('/login', function (req, res) {
	res.render('login', { title: 'Admin' });
  // if (!req.query.username || !req.query.password) {
  //   res.send('login failed');    
  // } else if(req.query.username === "admin" || req.query.password === "admin") {
  //   req.session.user = "admin";
  //   req.session.admin = true;
  //   res.send("login success!");
  // }
});

router.all('/admin/*', requireLogin, function(req, res, next) {
	res.render('admin', { title: 'Admin' });
	sess = req.session;
});*/

router.get('/login', function(req,res){
	res.render('login', { title: 'Admin' });
});

router.post('/login/pending', function(req,res){
	if (req.body.username == "atrois" && req.body.password == "aze123.") {
		req.session.admin = true;
		res.redirect('/admin');
	} else {
		res.redirect('/');
	}
});

router.get('/admin', requireLogin, function(req,res){
	res.render('admin', { title: 'Admin' });
});

router.all('/admin/*', requireLogin, function(req, res) {

});

router.get('/logout',function(req,res){
	req.session.destroy(function(err) {
		if(err) {
			res.render('error', { message: 'Erreur', error: {status: 'Déconnexion', stack: err}});
		} else {
			res.redirect('/');
		}
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