const express = require('express');
const router = express.Router();

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');

const m$produk = require(`${__module_dir}/produk.module.js`);

router.get('/', async function (req, res, next) {
	const list = await m$produk.listProduct();
	helper.sendResponse(res, list);
});

router.post('/', async function (req, res, next) {
	const add = await m$produk.addProduct(req.body);
	helper.sendResponse(res, add);
});

router.get('/:id', async function (req, res, next) {
	const detail = await m$produk.getDetailProduct(req.params.id)
	helper.sendResponse(res, detail)
});

router.put('/:id', async function (req, res, next) {
	// const update = await m$karyawan.updateKaryawan({
	// 	name: req.body.name, 
	// 	date_birth: req.body.date_birth, 
	// 	position: req.body.position, 
	// }, req.params.id);

	const update = await m$produk.updateProduct({...req.body, id: req.params.id});
	helper.sendResponse(res, update);
});


router.delete('/:id', async function (req, res, next) {
	const deleteProduct = await m$produk.deleteProduct(req.params.id);
	helper.sendResponse(res, deleteProduct);
});

module.exports = router;
