const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
orderRouter
  .route('/')
  .post(authController.protect, orderController.newOrder)
  .get(authController.protect, orderController.getMyOrders)
  .patch(authController.protect, productController.getProductsByName)
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.getAllProducts
  );

module.exports = orderRouter;
