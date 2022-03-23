const express = require('express');
const revRouter = express.Router();
const revController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

revRouter.route('/').post(authController.protect, revController.addReview);

module.exports = revRouter;
