const express = require('express');
const meRouter = express.Router();
const authController = require('../controllers/authController');
const meController = require('../controllers/meController');

meRouter
  .route('/')
  .get(authController.protect, meController.getMyData)
  .patch(authController.protect, authController.updatePassword);

module.exports = meRouter;
