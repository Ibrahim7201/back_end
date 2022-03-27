const Product = require('../models/productsModel');
const Vendor = require('../models/vendorModel');
const OrderItem = require('../models/orderItemModel');
const AppError = require('../utils/appError');

exports.getProductsByCg = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.body.category });
    if (!products) {
      return next(new AppError('No products found', 404));
    }
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting products by category`, 500));
  }
};
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (!products) {
      return next(new AppError('No products found', 404));
    }
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting products`, 500));
  }
};
exports.queryProductByName = async (req, res, next) => {
  try {
    const products = await Product.find({
      name: { $regex: `${req.body.name}`, $options: 'i' },
    });
    if (!products) {
      return next(new AppError('No products found', 404));
    }
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting products by name`, 500));
  }
};
