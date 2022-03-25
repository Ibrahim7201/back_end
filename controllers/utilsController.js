const cloudinary = require('../utils/cloudinary');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

exports.uploadImage = async function (req, res, next) {
  try {
    cloudinary.uploader.upload(req.file.path, function (err, result) {
      console.log('Error: ', err);
      console.log('Result: ', result);
      res.json(result.url);
    });
  } catch (err) {
    err.statusCode = 404;
    err.code = 'Error in uploading img';
    next(err);
  }
};
