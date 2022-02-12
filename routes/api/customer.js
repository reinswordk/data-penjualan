const express = require('express');
const router = express.Router();

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');

const m$customer = require(`${__module_dir}/customer.module.js`);

router.get('/', async function (req, res, next) {
	const list = await m$customer.listCustomer();
	helper.sendResponse(res, list);
});

router.post('/', async function (req, res, next) {
	const add = await m$customer.addCustomer(req.body);
	helper.sendResponse(res, add);
});

router.get('/:id', async function (req, res, next) {
	const detail = await m$customer.getDetailCustomer(req.params.id)
	helper.sendResponse(res, detail)
});

router.put('/:id', async function (req, res, next) {
	// const update = await m$karyawan.updateKaryawan({
	// 	name: req.body.name, 
	// 	date_birth: req.body.date_birth, 
	// 	position: req.body.position, 
	// }, req.params.id);

	const update = await m$customer.updateCustomer({...req.body, id: req.params.id});
	helper.sendResponse(res, update);
});


router.delete('/:id', async function (req, res, next) {
	const deleteCustomer = await m$customer.deleteCustomer(req.params.id);
	helper.sendResponse(res, deleteCustomer);
});

module.exports = router;
