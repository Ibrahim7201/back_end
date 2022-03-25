const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const utilsRouter = express.Router();
const utilsController = require('../controllers/utilsController');
const upload = require('../utils/multer');

utilsRouter
  .route('/')
  .post(upload.single('photo'), utilsController.uploadImage);

module.exports = utilsRouter;
