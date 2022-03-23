const express = require('express');
const discRouter = express.Router();
const discountController = require('../controllers/discountController');
const authController = require('../controllers/authController');
discRouter
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    discountController.applyDiscountOnCategory
  )
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    discountController.applyDiscountOnSubCategory
  );

module.exports = discRouter;
