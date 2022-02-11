var express = require('express');
var router = express.Router();
const session = require(__module_dir+'/session.module.js');

router.get('/', session.sessionChecker, function(req, res, next) {
  res.render('pages/not_found/404');
});

router.get('/notfound', session.sessionChecker, function(req, res, next) {
	const {profile} = req.session;
	const page = {
			title: 'Error 404 - Page not Found',
			subtitle: '',
		};

	res.render('pages/not_found/body',{
			profile,
			page,
		});
});

module.exports = router;
