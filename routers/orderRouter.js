const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
orderRouter
  .route('/')
  .post(authController.protect, orderController.newOrder)
  .get(authController.protect, orderController.getMyOrders);

module.exports = orderRouter;
