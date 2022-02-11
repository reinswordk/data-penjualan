const express = require('express');
const router = express.Router();
const date = require('date-and-time');
const path = require('path');
const hashids = new (require('hashids'))(__random);

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');
const currentRouter = path.basename(__filename,  path.extname(__filename));

router.get('/', session.sessionChecker, session.groupChecker, async function (req, res, next) {
	const profile = req.session.profile;
	const page = {
			title : `FLOWMETER DEVICE`,
			subtitle : '---------------',
		};

	res.redirect(`${__publicurl}/ticket`);
});

module.exports = router;
