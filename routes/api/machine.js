const express = require('express');
const router = express.Router();

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');

const m$machine = require(`${__module_dir}/machine.module.js`);

router.get('/list-production', session.sessionChecker, session.groupChecker, async function (req, res, next) {
	const list = await m$machine.listMachineProduction();
	helper.sendResponse(res, list);
});

router.get('/list', session.sessionChecker, session.groupChecker, async function (req, res, next) {
	const list = await m$machine.listMachine();
	helper.sendResponse(res, list);
});

router.get('/detail/:id', session.sessionChecker, session.groupChecker, async function (req, res, next) {
	const list = await m$machine.listMachine({ id: req.params.id });
	helper.sendResponse(res, list);
});

router.post('/add', session.sessionChecker, session.groupChecker, async function (req, res, next) {
	const add = await m$machine.addMachine(req.body);
	helper.sendResponse(res, add);
});

router.put('/update/:id', session.sessionChecker, session.groupChecker, async function (req, res, next) {
	const update = await m$machine.updateMachine({...req.body, id: req.params.id});
	helper.sendResponse(res, update);
});

router.delete('/delete/:id', session.sessionChecker, session.groupChecker, async function (req, res, next) {
	const deleteMachine = await m$machine.deleteMachine(req.params.id);
	helper.sendResponse(res, deleteMachine);
});

module.exports = router;
