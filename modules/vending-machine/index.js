'use strict';

(() => {
    const express = require('express');
    const vendorRouterRouter = express.Router();
    const validationHelper = require('../middleware/validation/vending-machine');


    const vendorProduct = require('./methods');
    vendorRouterRouter.get('/', vendorProduct.get);

    vendorRouterRouter.post('/buy', validationHelper.validate('buy'), vendorProduct.buyProduct );
    vendorRouterRouter.post('/refund', validationHelper.validate('refund'), vendorProduct.refundProduct );

    module.exports = vendorRouterRouter;
})();
