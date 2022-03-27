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
  .post(authController.protect, statsController.queryProductByName);
module.exports = statsRouter;
