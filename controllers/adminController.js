const Order = require('../models/orderModel');
const AppError = require('../utils/appError');

exports.getAllPendingOrders = async (req, res, next) => {
  try {
    const pending = await Order.find({
      'status.isOnWay': false,
      vendorName: 'JUMIA',
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Pending Orders are here',
        pending,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting pending Orders`, 422));
  }
};

exports.acceptOrder = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const order = await Order.findById(_id);
    if (!order) return next(new AppError(`Order doesn't exist`, 422));
    if (order.status.isOnWay !== true)
      return next(new AppError(`Order already On way`, 422));
    await Order.findByIdAndUpdate(id, {
      $set: { 'status.isOnWay': true },
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Order Accepted',
        order,
      },
    });
  } catch (err) {
    next(new AppError(`Error in accepting Order`, 422));
  }
};
