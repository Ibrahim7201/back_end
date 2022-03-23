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

///////////////////////

// variant = {
//   name: color,
//   options: [id1, id2],
// };

// product = {
//   /////
//   /////
//   /////
//   /////
//   stock: 'total stock',
//   variants: [
//     {
//       name: 'stock',
//       options: [
//         { variants: ['red', 'small', '17"inch'], value: 30 },
//         { variants: ['red', 'large'], value: 4 },
//       ],
//     },
//   ],
// };
