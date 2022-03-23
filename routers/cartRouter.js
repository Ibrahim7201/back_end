const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
cartRouter
  .route('/')
  .post(authController.protect, cartController.addToCart)
  .get(authController.protect, cartController.getCartData);

module.exports = cartRouter;
