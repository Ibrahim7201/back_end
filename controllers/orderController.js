const Order = require('../models/orderModel');
const User = require('../models/userModel');
const OrderItem = require('../models/orderItemModel');
const Product = require('../models/productsModel');
const Notification = require('../models/notificationModel');
const AppError = require('../utils/appError');
const Cart = require('../models/cartModel');

exports.newOrder = async (req, res, next) => {
  try {
    const { shippingAddress, productId, paymentMethod, quantity } = req.body;
    if (req.orderItems) {
      const orderItems = req.orderItems.map(el => {
        return {
          productId: el.productId,
          quantity: el.quantity,
          price: el.price,
        };
      });
      let OrderItemsArray = [];
      for (let i in orderItems) {
        const Orderitem = await OrderItem.create({
          ...orderItems[i],
        });
        OrderItemsArray.push(Orderitem._id);
        await Product.findOneAndUpdate(
          { _id: orderItems[i].productId },
          { $push: { orders: Orderitem._id } }
        );
      }
      const order = await Order.create({
        paymentMethod,
        shippingAddress,
        userId: req.user._id,
        orderItems: OrderItemsArray,
      });
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { orders: order._id } }
      );
      await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { items: [] } }
      );
      orderItems.forEach(async item => {
        const product = await Product.findById(item.productId);
        await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { stock: -+item.quantity, sold: +item.quantity } }
        );
        await Order.findOneAndUpdate(
          { _id: order._id },
          { $push: { billRaw: item.price } }
        );

        await Notification.create({
          userId: product.vendorId,
          content: `${
            product.vendorName !== 'JUMIA' ? req.user.name : product.vendorName
          } has ordered ${product.name}`,
        });
      });
    } else {
      const product = await Product.findById(productId).populate('discount');
      if (!product) return next(new AppError(`Product Not Found`, 422));
      const orderItem = OrderItem.create({
        productId,
        quantity,
        price: product.currentPrice,
      });
      const order = await Order.create({
        paymentMethod,
        shippingAddress,
        userId: req.user._id,
        orderItems: [orderItem._id],
      });
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { orders: order._id } }
      );
      const { currentPrice } = await Product.findById(id).populate('discount');
      await Product.findOneAndUpdate(
        { _id: id },
        {
          $inc: { stock: -+quantity, sold: +quantity },
          $push: { orders: orderItem._id },
        }
      );
      await Order.findOneAndUpdate(
        { _id: order._id },
        { $push: { billRaw: currentPrice } }
      );
      await Notification.create({
        userId: product.vendorId,
        content: `${
          product.vendorName !== 'JUMIA' ? req.user.name : product.vendorName
        } has ordered ${product.name}`,
      });
    }
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Order Created',
      },
    });
  } catch (err) {
    next(new AppError(`Error in creating Order`, 422));
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await User.find({ userId: req.user._id }).populate({
      path: 'orderItems',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Your orders are here',
        orders,
      },
    });
  } catch (err) {
    next(new AppError(`Error in viewing your orders`, 422));
  }
};
