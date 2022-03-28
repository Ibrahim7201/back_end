const express = require('express');
const orderstatusRouter = express.Router();
const authController = require('../controllers/authController');
const orderstatusController = require('../controllers/orderstatusController');

orderstatusRouter
  .route('/')
  .post(authController.protect, orderstatusController.deliverOrder)
  .put(authController.protect, orderstatusController.payOrder)
  .delete(authController.protect, orderstatusController.cancelOrder)
  .get(authController.protect, orderstatusController.getMyOrdersStats);

module.exports = orderstatusRouter;
