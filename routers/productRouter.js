const express = require('express');
const prodRouter = express.Router({ mergeParams: true });
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
prodRouter
  .route('/:name?')
  .post(
    authController.protect,
    authController.restrictTo('vendor', 'admin'),
    productController.addProduct
  )
  .get(authController.protect, productController.getProductByName)
  .put(
    authController.protect,
    authController.restrictTo('vendor', 'admin'),
    productController.addInStock
  )
  .delete(
    authController.protect,
    authController.restrictTo('vendor', 'admin'),
    productController.removeProductsFromStock
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.acceptOrder
  );

module.exports = prodRouter;
