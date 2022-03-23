const Cart = require('../models/cartModel');
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
    let cartNew;
    if (!cartOld) {
      cartNew = await Cart.create({ userId: req.user._id });
    }
    let { items, _id } = cartOld || cartNew;
    let condition = [];
    items.forEach(async el => {
      if (el.productId.toString() === product._id.toString()) {
        el.quantity = +el.quantity + +quantity;
        condition.push(true);
      }
    });
    if (!condition.some(el => el === true)) {
      items.push({
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
