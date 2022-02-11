var express = require('express');
var router = express.Router();
const session = require(__module_dir+'/session.module.js');

router.get('/', function(req, res, next) {
	res.render('pages/login', { title: 'Express' });
});

router.post('/', session.loginValidation);

router.post('/register', session.sessionChecker, async function (req, res, next) {
	const {username, password, groupId} = req.body;

	const save = await session.registerUser(username, password, groupId);

	res.send(save);
});

router.get('/logout', session.logout);

module.exports = router;
