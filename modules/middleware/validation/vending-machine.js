'use strict';

const { body } = require('express-validator');
exports.validate = (method) => {
    switch (method) {
        case 'buy': {
            return [
                body('productName', "Product name is required and must be one of ['Coke', 'Sprite', 'Mountain Dew']").not().isEmpty().isIn(['Coke', 'Sprite', 'Mountain Dew']),
                body('productQuantity', "Product Quantity is required").isInt({min: 1}),
                body('amount', 'Amount is required').isInt({min: 1})
            ]
        }
        case 'refund': {
            return [
                body('productName', "Product name is required and must be one of ['Coke', 'Sprite', 'Mountain Dew']").not().isEmpty().isIn(['Coke', 'Sprite', 'Mountain Dew']),
                body('productQuantity', "Product Quantity is required").isInt({min: 1})
            ]
        }
    }
}