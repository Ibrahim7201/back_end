const mongoose = require('mongoose');
const reveiwSchema = new mongoose.Schema({
  rate: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Provide Rate'],
  },
  content: {
    type: String,
    required: [true, 'Please Add content'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Review = mongoose.model('Review', reveiwSchema);
module.exports = Review;
