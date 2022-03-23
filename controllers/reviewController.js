const Review = require('../models/reviewModel');
const Product = require('../models/productsModel');
const AppError = require('../utils/appError');

exports.addReview = async (req, res, next) => {
  try {
    const { content, rate, product_id } = req.body;
    const reviewAdded = await Review.create({
      author: req.user._id,
      content,
      rate,
      product_id,
    });
    let { reviews } = await Product.findOne({ _id: product_id });
    reviews.push(reviewAdded);
    await Product.findOneAndUpdate({ _id: product_id }, { reviews });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'success',
        reviewAdded,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding Review`, 422));
  }
};
