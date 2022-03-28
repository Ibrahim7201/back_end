const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
orderRouter
  .route('/')
  .post(authController.protect, orderController.newOrder)
  .get(authController.protect, orderController.getMyOrders)
  .patch(authController.protect, productController.getProductsByName);

module.exports = orderRouter;
