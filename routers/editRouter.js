const express = require('express');
const editRouter = express.Router();
const authController = require('../controllers/authController');
const editController = require('../controllers/editController');

editRouter
  .route('/')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    editController.editProduct
  );

module.exports = editRouter;
