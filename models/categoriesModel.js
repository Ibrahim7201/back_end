const mongoose = require('mongoose');
const cgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  subCategories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'SubCategory',
  },
});

const Category = mongoose.model('Category', cgSchema);

module.exports = Category;
