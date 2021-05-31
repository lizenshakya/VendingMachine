'use strict';

(() => {
    const express = require('express');
    const router = express.Router();

    const vendingMachine = require('../modules/vending-machine');
    router.use('/vending-machine', vendingMachine);
    
    module.exports = router;
})();
