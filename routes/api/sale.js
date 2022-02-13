const express = require('express');
const router = express.Router();

const session = require(__module_dir + '/session.module.js');
const helper = require(__class_dir + '/helper.class.js');

const m$sale = require(`${__module_dir}/sale.module.js`);

router.get('/', async function (req, res, next){
    const listSales = await m$sale.listSales();
    helper.sendResponse(res, listSales);
});

router.get('/:id', async function (req, res, next){
    const sale = await m$sale.getDetailSale(req.params.id);
    helper.sendResponse(res, sale);
});

router.post('/', async function (req, res, next) {
    const add = await m$sale.addSale(req.body);
    helper.sendResponse(res, add);
});

router.put('/:id', async function (req, res, next) {
    const update = await m$sale.updateSale({...req.body, id: req.params.id});
    helper.sendResponse(res,update)
});

router.delete('/:id', async function (req, res, next) {
    const deleteSale = await m$sale.deleteSale(req.params.id);
    helper.sendResponse(res, deleteSale);
});

module.exports = router;
