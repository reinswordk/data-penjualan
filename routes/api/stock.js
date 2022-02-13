const express = require('express');
const router = express.Router();

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');

const m$stock = require(`${__module_dir}/stock.module.js`);

router.get('/', async function (req, res, next) {
	const list = await m$stock.listStock();
	helper.sendResponse(res, list);
});

router.post('/', async function (req, res, next) {
	const add = await m$stock.addStock(req.body);
	helper.sendResponse(res, add);
});

router.put('/:id', async function (req, res, next) {
	const update = await m$stock.updateStock({...req.body, id: req.params.id});
	helper.sendResponse(res, update);
});

router.delete('/:id', async function (req, res, next) {
	const deleteStock = await m$stock.deleteStock(req.params.id);
	helper.sendResponse(res, deleteStock);
});

router.get("/:id", async function(req, res, next){
	const detail = await m$stock.getDetailStock(req.params.id);
	helper.sendResponse(res, detail)
});

module.exports = router;
