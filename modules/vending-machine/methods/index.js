'use strict';

((vendingMachineController)=>{
    const { validationResult } = require('express-validator');
    const dbQueryHelper = require('../../../helpers/common-provider-function');
    const sendResponse = require('../../../helpers/commonResponseHelper');
    const moduleConfig = require('../config/config.js')
    const helperFunct = {
        calculateChange: (productPrice, amount, productQuantity) => {
            return amount - (productPrice * productQuantity);
        },
        comparePrice: (productPrice, amount, productQuantity) => {
            const amountEntered = (amount / productQuantity);
            return amountEntered >= productPrice;
        }
    }
    
    vendingMachineController.get = async (req, res, next) => {
        try {
            const getProductInfo = await dbQueryHelper.getAllDocumentByQuery({
                req, 
                collectionName: 'productTbl', 
                queryOpts: {}, 
                projectionFields: {
                    "productInfo.productName": 1,
                    "productInfo.initialProductQuantity": 1,
                    "productInfo.productPrice": 1,
                    "productInfo.remainingProductQuantity": 1,
                    "soldAmount": 1
                }
            });
            if(getProductInfo && getProductInfo.length > 0) {
                return sendResponse.sendSuccessDataResponse(res, {
                    status: 200,
                    message: moduleConfig.message.dataFound,
                    data: getProductInfo[0]
                });
            }
            return sendResponse.sendErrorResponse({res, errorMsg: moduleConfig.message.notFound, status: 404})
        } catch (err) {
            console.log(err);
            return next(err)
        }
    };

    vendingMachineController.buyProduct = async (req, res, next) => {
        try {
            const checkProduct = await validationResult(req);
            if(checkProduct && checkProduct.errors && checkProduct.errors.length > 0) {
                return sendResponse.sendValidationErrorMessage({res, message: moduleConfig.message.validationError, errors: checkProduct.errors})
            }

            const { productName, productQuantity, amount } = req.body;
            const productInfo = await dbQueryHelper.getDocumentByQuery({
            req, 
            collectionName: 'productTbl', 
            queryOpts: {
                "productInfo.productName": productName,
                "productInfo.remainingProductQuantity": {
                    "$gte": productQuantity
                }
            }, 
            projectionFields: {
                'soldAmount': 1,
                "productInfo.productName": 1,
                "productInfo.initialProductQuantity": 1,
                "productInfo.productPrice": 1,
                "productInfo.remainingProductQuantity": 1,
                "productInfo.soldPrice": 1,
                "productInfo.soldProductQuantity": 1
            }
        });
        if(productInfo && Object.keys(productInfo).length > 0) {
            const customerProduct = productInfo.productInfo.filter(item => item.productName === productName);
            let queryOpts = {}, change = 0, setOpts = {};
            
            const {  initialProductQuantity, productPrice, remainingProductQuantity, soldPrice, soldProductQuantity } = customerProduct[0];
            const isPriceValid = helperFunct.comparePrice(productPrice, amount, productQuantity);
            if(remainingProductQuantity <= 0) {
                return sendResponse.sendValidationErrorMessage({res, message: moduleConfig.message.validationError, errors: [ {msg: 'No product left',fields: 'Product Quantity'}]})
            }
            if(!isPriceValid) {
                return sendResponse.sendValidationErrorMessage({res, message: moduleConfig.message.validationError, errors: [ {msg: 'Entered price is less than actual',fields: 'Amount'}]})
            }
            if(remainingProductQuantity &&  (remainingProductQuantity - productQuantity) < 0) {
                return sendResponse.sendValidationErrorMessage({res, message: moduleConfig.message.validationError, errors: [ {msg: moduleConfig.message.productMoreThanSelected, fields: 'productQuantity'}]})
            }
            if(productPrice   <= (amount / productQuantity)) {
                if(productPrice < (amount / productQuantity)) {
                    change = helperFunct.calculateChange(productPrice, amount, productQuantity);
                }

            }
            queryOpts = { "productInfo.productName" : productName },
            setOpts= { 
                "soldAmount": productInfo.soldAmount + (productPrice * productQuantity), 
                "productInfo.$.remainingProductQuantity": remainingProductQuantity - productQuantity,
                "productInfo.$.soldPrice": soldPrice + (productPrice * productQuantity),
                "productInfo.$.soldProductQuantity": soldProductQuantity + productQuantity

            }
            const update = await dbQueryHelper.updateDocument({req, collectionName: 'productTbl', queryOpts, objToSave: setOpts});
            if(update && update.err) {
                return sendResponse.sendErrorResponse({res, errorMsg: moduleConfig.message.serverError, status: 400})

            }
            return sendResponse.sendSuccessDataResponse(res, {
                status: 200,
                message: moduleConfig.message.productSelected,
                data: {
                    change,
                    productName,
                    productPrice,
                    productQuantity
                }
            });
           }
           return sendResponse.sendErrorResponse({res, errorMsg: moduleConfig.message.notFound, status: 404});          
        } catch (err) {
            console.log(err);
            return next(err)
        }
    };

    vendingMachineController.refundProduct = async (req, res, next) => {
        try {
           const { productName, productQuantity } = req.body;
           const checkProduct = await validationResult(req);
           if(checkProduct && checkProduct.errors && checkProduct.errors.length > 0) {
               return sendResponse.sendValidationErrorMessage({res, message: moduleConfig.message.validationError, errors: checkProduct.errors})
           }
           const productInfo = await dbQueryHelper.getDocumentByQuery({
            req, 
            collectionName: 'productTbl', 
            queryOpts: {
                "productInfo.productName": productName
            }, 
            projectionFields: {
                'soldAmount': 1,
                "productInfo.productName": 1,
                "productInfo.initialProductQuantity": 1,
                "productInfo.productPrice": 1,
                "productInfo.remainingProductQuantity": 1,
                "productInfo.soldPrice": 1,
                "productInfo.soldProductQuantity": 1
            }
        });
        if(productInfo && Object.keys(productInfo).length > 0) {
            const customerProduct = productInfo.productInfo.filter(item => item.productName === productName && item.initialProductQuantity !== item.remainingProductQuantity);
            if(customerProduct && customerProduct.length <= 0) {
                return sendResponse.sendErrorResponse({res, errorMsg: moduleConfig.message.notSoldYet, status: 404});          

            }
            let queryOpts = {}, setOpts = {};
            const { initialProductQuantity, productPrice, remainingProductQuantity, soldPrice, soldProductQuantity } = customerProduct[0];
            if((initialProductQuantity - remainingProductQuantity === 0) || !((initialProductQuantity - remainingProductQuantity) - productQuantity >= 0)) {
                return sendResponse.sendErrorResponse({res, errorMsg: moduleConfig.message.productMoreThanSelected, status: 403});          

            }
            queryOpts = { "productInfo.productName" : productName },
            setOpts= { 
                "soldAmount": productInfo.soldAmount - productPrice * productQuantity, 
                "productInfo.$.remainingProductQuantity": remainingProductQuantity + productQuantity,
                "productInfo.$.soldPrice": soldPrice - productPrice * productQuantity,
                "productInfo.$.soldProductQuantity": soldProductQuantity + productQuantity

            }
           const update = await dbQueryHelper.updateDocument({req, collectionName: 'productTbl', queryOpts, objToSave: setOpts});
            if(update && update.err) {
                return sendResponse.sendErrorResponse({res, errorMsg: moduleConfig.message.serverError, status: 400})

            }
            return sendResponse.sendSuccessDataResponse(res, {
                status: 200,
                message: moduleConfig.message.refundSuccess,
                data: {
                    productName,
                    productPrice,
                    productQuantity,
                    total: productPrice * productQuantity
                }
            });
           }
           return sendResponse.sendErrorResponse({res, errorMsg: moduleConfig.message.notFound, status: 404});         
        } catch (err) {
            return next(err)
        }
    };
})(module.exports);