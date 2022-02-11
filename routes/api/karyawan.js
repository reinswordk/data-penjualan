const express = require('express');
const router = express.Router();

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');

const m$karyawan = require(`${__module_dir}/karyawan.module.js`);

router.get('/', async function (req, res, next) {
	const list = await m$karyawan.listKaryawan();
	helper.sendResponse(res, list);
});

router.post('/', async function (req, res, next) {
	const add = await m$karyawan.addKaryawan(req.body);
	helper.sendResponse(res, add);
});

router.get('/:id', async function (req, res, next) {
	const detail = await m$karyawan.getDetailKaryawan(req.params.id)
	helper.sendResponse(res, detail)
});

router.put('/:id', async function (req, res, next) {
	// const update = await m$karyawan.updateKaryawan({
	// 	name: req.body.name, 
	// 	date_birth: req.body.date_birth, 
	// 	position: req.body.position, 
	// }, req.params.id);

	const update = await m$karyawan.updateKaryawan({...req.body, id: req.params.id});
	helper.sendResponse(res, update);
});


router.delete('/:id', async function (req, res, next) {
	const deleteKaryawan = await m$karyawan.deleteKaryawan(req.params.id);
	helper.sendResponse(res, deleteKaryawan);
});

module.exports = router;
