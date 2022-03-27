const Product = require('../models/productsModel');
const AppError = require('../utils/appError');

exports.editProduct = async (req, res, next) => {
  try {
    const { _id, name, price, description, photo } = req.body;
    const product = await Product.findById(_id);
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { name, price, description, photo },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct,
      },
    });
  } catch (err) {
    next(new AppError(`Error in editing product`, 422));
  }
};
