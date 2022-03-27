const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
cartRouter
  .route('/')
  .post(authController.protect, cartController.addToCart)
  .get(authController.protect, cartController.getCartData)
  .delete(authController.protect, cartController.removeFromCart)
  .put(
    authController.protect,
    cartController.checkout,
    orderController.newOrder
  );

module.exports = cartRouter;
