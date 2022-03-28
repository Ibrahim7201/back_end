const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Product = require('../models/productsModel');
const AppError = require('../utils/appError');

exports.deliverOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.body._id);
    if (!order) {
      return next(new AppError('No order found with that id', 404));
    }
    await Order.findOneAndUpdate(
      { _id: req.body._id },
      { status: { isDelivered: true } }
    );
    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(new AppError(`Error in delivering order`, 500));
  }
};

exports.payOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.body._id);
    if (!order) {
      return next(new AppError('No order found with that id', 404));
    }
    await Order.findOneAndUpdate(
      { _id: req.body._id },
      { status: { isPaid: true } }
    );
    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(new AppError(`Error in paying order`, 500));
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.body._id);
    if (!order) {
      return next(new AppError('No order found with that id', 404));
    }
    await Order.findOneAndUpdate(
      { _id: req.body._id },
      { status: { isCancelled: true } }
    );
    res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    next(new AppError(`Error in cancelling order`, 500));
  }
};

exports.getMyOrdersStats = async (req, res, next) => {
  try {
    let products;
    if (req.user.role === 'admin') {
      products = await Product.find(
        { vendorName: 'JUMIA' },
        { sold: 1, orders: 1 }
      ).sort({ sold: -1 });
    } else if (req.user.role === 'vendor') {
      products = await Product.find(
        { vendorId: req.user._id },
        { sold: 1, orders: 1 }
      ).sort({ sold: -1 });
    }
    res.status(201).json({
      status: 'sucess',
      data: {
        totalSold: products.reduce((acc, cur) => acc + cur.sold, 0),
        totalOrders: products.reduce((acc, cur) => acc + cur.orders.length, 0),
        mostSold: products[0],
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting orders stats`, 422));
  }
};
