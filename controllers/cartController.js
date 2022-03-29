const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productsModel');
const AppError = require('../utils/appError');
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId)
      .populate('reviews')
      .populate('discount')
      .populate('category')
      .populate('subCategory');
    const cartOld = await Cart.findOne({ userId: req.user._id });

    let { items, _id } = cartOld;
    let condition = [];
    items.forEach(async el => {
      if (el.productId.toString() === product._id.toString()) {
        el.quantity = +el.quantity + +quantity;
        condition.push(true);
      }
    });
    if (!condition.some(el => el === true)) {
      items.push({
        vendorName: product.vendorName,
        vendorId: product.vendorId,
        productId: product._id,
        name: product.name,
        price: product.currentPrice,
        quantity,
      });
    }

    const finalCart = await Cart.findOneAndUpdate({ _id }, { items });
    res.status(200).json({
      status: 'success',
      data: {
        status: 'Added to cart',
        cart: finalCart,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding item`, 422));
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    let { items } = cart;
    items = items.filter(
      el => el.productId.toString() !== productId.toString()
    );
    const finalCart = await Cart.findOneAndUpdate({ _id: cart._id }, { items });
    res.status(200).json({
      status: 'success',
      data: {
        status: 'Removed from cart',
        cart: finalCart,
      },
    });
  } catch (err) {
    next(new AppError(`Error in removing item`, 422));
  }
};

exports.getCartData = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Cart Is Here',
        cart,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting cart`, 422));
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const { items } = await Cart.findOne({ userId: req.user._id });
    if (!items) return next(new AppError(`No items in cart`, 422));
    req.orderItems = items;
    next();
  } catch (err) {
    next(new AppError(`Error in checking out`, 422));
  }
};
