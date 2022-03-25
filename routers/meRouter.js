const express = require('express');
const meRouter = express.Router();
const authController = require('../controllers/authController');
const meController = require('../controllers/meController');
const upload = require('../utils/multer');

meRouter
  .route('/')
  .get(authController.protect, meController.getMyData)
  .patch(authController.protect, authController.updatePassword)
  .post(upload.single('photo'), authController.uploadImage);

module.exports = meRouter;
