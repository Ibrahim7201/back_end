const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productsModel');
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
    const cart = await Cart.findOne({ userId: req.user._id });
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

exports.proceedToCheckout = async (req, res, next) => {
  try {
    const { items } = await Cart.findOne({ userId: req.user._id });
    const { vendorName, vendorId, productId, name, quantity, price } = items;
    const order = await Order.create({
      paymentMethod,
      shippingAddress,
      vendorId,
      vendorName,
      products,
      userId: req.user._id,
    });
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { orders: order._id } }
    );
    products.forEach(async id => {
      const { currentPrice } = await Product.findById(id).populate('discount');
      const product = await Product.findOneAndUpdate(
        { _id: id },
        { $inc: { stock: -1, sold: 1 } }
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
    });

    res.status(201).json({
      status: 'success',
      data: {
        status: 'Order Created',
        order: await Order.findById(order._id),
      },
    });
  } catch (err) {
    next(new AppError(`Error in Checkout Order`, 422));
  }
};
