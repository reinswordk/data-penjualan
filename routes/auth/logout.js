var express = require('express');
var router = express.Router();
const session = require(__module_dir+'/session.module');

router.get('/',session.logout);

router.post('/',session.logoutV2);

module.exports = router;
