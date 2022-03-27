const express = require('express');
const variantRouter = express.Router();
const variantController = require('../controllers/variantController');
const authController = require('../controllers/authController');
variantRouter
  .route('/:subCategory?')
  .post(authController.protect, variantController.addVariant)
  .get(authController.protect, variantController.showVariants);

module.exports = variantRouter;
