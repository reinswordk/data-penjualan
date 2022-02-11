var express = require('express');
var router = express.Router();
const session = require(__module_dir+'/session.module.js');

router.get('/login', function(req, res, next) {
  res.render('pages/login', { title: 'Express' });
});

router.post('/login',session.loginValidation);

router.get('/logout',session.logout);

router.post('/logout',session.logout);

module.exports = router;
