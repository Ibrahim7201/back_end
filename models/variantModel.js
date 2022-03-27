const mongoose = require('mongoose');
const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Enter variant's name`],
  },
  options: {
    type: [String],
  },
});

const Variant = mongoose.model('Variant', variantSchema);
module.exports = Variant;
