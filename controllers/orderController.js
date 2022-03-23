const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productsModel');
const AppError = require('../utils/appError');

exports.newOrder = async (req, res, next) => {
  try {
    const { shippingAddress, vendorId, products } = req.body;
    const order = await Order.create({
      shippingAddress,
      vendorId,
      products,
      userId: req.user._id,
    });
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { orders: order._id } }
    );
    products.forEach(async id => {
      const { currentPrice } = await Product.findById(id).populate('discount');
      await Order.findOneAndUpdate(
        { _id: order._id },
        { $push: { billRaw: currentPrice } }
      );
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Order Created',
        order: await Order.findById(order._id),
      },
    });
  } catch (err) {
    console.log(err);
    next(new AppError(`Error in creating Order`, 422));
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('orders')
      .populate({
        path: 'orders',
        populate: {
          path: 'products',
          model: 'Product',
          populate: {
            path: 'discount',
            model: 'Discount',
          },
        },
      });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Your orders are here',
        orders: user.orders,
      },
    });
  } catch (err) {
    next(new AppError(`Error in viewing your orders`, 422));
  }
};
