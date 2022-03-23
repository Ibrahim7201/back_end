const mongoose = require('mongoose');
const scgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
  variants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Variant',
    default: [],
  },
});

const SubCategory = mongoose.model('SubCategory', scgSchema);
module.exports = SubCategory;
