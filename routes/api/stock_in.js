const express = require('express');
const { deleteProduct } = require('../../module/produk.module');
const router = express.Router();

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');

const m$stockIn = require(`${__module_dir}/stock_in.module.js`);

router.get('/', async function (req, res, next) {
	const list = await m$stockIn.listStockIn();
	helper.sendResponse(res, list);
});

router.get('/:id', async function (req, res, next) {
    const stockIn = await m$stockIn.getDetailStockIn(req.params.id);
    helper.sendResponse(res, stockIn);
});

router.post('/', async function (req, res, next) {
    const add = await m$stockIn.addStockIn(req.body); 
    helper.sendResponse(res, add);
});

router.put('/:id', async function (req, res, next) {
    const update = await m$stockIn.updateStockIn({...req.body, id: req.params.id});
    helper.sendResponse(res, update);
});

router.delete('/:id', async function (req, res, next) {
    const deleteStockIn = await m$stockIn.deleteStockIn(req.params.id);
    helper.sendResponse(res, deleteStockIn);
});

module.exports = router;

