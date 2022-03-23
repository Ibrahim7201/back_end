const express = require('express');
const scgRouter = express.Router();
const scgController = require('../controllers/scgController');
const authController = require('../controllers/authController');
scgRouter
  .route('/:name?')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    scgController.addSubCategory
  )
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    scgController.getProductsBySubCategory
  );

module.exports = scgRouter;
