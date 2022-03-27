const express = require('express');
const statsRouter = express.Router();
const statsController = require('../controllers/statsController');
const authController = require('../controllers/authController');
statsRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    statsController.getProductsByCg
  )
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    statsController.getAllProducts
  )
  .post(authController.protect, statsController.queryProductByName)
  .patch(authController.protect, statsController.getTopFiveSoldProducts)
  .options(authController.protect, statsController.getTopThreeDiscounts);
module.exports = statsRouter;
