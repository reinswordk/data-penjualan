const express = require('express');
const { deleteProduct } = require('../../module/produk.module');
const router = express.Router();

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');

const m$stockOut = require(`${__module_dir}/stock_out.module.js`);

router.get('/', async function (req, res, next) {
	const list = await m$stockOut.listStockOut();
	helper.sendResponse(res, list);
});

router.get('/:id', async function (req, res, next) {
    const stockIn = await m$stockOut.getDetailStockOut(req.params.id);
    helper.sendResponse(res, stockIn);
});

router.post('/', async function (req, res, next) {
    const add = await m$stockOut.addStockOut(req.body); 
    helper.sendResponse(res, add);
});

router.put('/:id', async function (req, res, next) {
    const update = await m$stockOut.updateStockOut({...req.body, id: req.params.id});
    helper.sendResponse(res, update);
});

router.delete('/:id', async function (req, res, next) {
    const deleteStockOut = await m$stockOut.deleteStockOut(req.params.id);
    helper.sendResponse(res, deleteStockOut);
});

module.exports = router;

