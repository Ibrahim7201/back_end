const Discount = require('../models/discountModel');
const Category = require('../models/categoriesModel');
const SubCategory = require('../models/subCategoriesModel');
const Product = require('../models/productsModel');
const AppError = require('../utils/appError');

exports.applyDiscountOnCategory = async (req, res, next) => {
  try {
    const { name, percentage, endDate, category } = req.body;
    const discount = await Discount.create({ name, percentage, endDate });
    const { subCategories } = await Category.findOne({
      name: category,
    }).populate('subCategories');
    subCategories.forEach(async sCg => {
      const { products } = await SubCategory.findOne({ _id: sCg._id }).populate(
        'products'
      );
      products.forEach(async product => {
        await Product.findOneAndUpdate({ _id: product._id }, { discount });
      });
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Discount Added to whole Category',
        discount: discount,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding discount for whole category`, 422));
  }
};

exports.applyDiscountOnSubCategory = async (req, res, next) => {
  try {
    const { name, percentage, endDate, subcategory } = req.body;
    const discount = await Discount.create({ name, percentage, endDate });
    const { products } = await SubCategory.findOne({ name: subcategory });
    products.forEach(async product => {
      await Product.findOneAndUpdate({ _id: product._id }, { discount });
    });

    res.status(201).json({
      status: 'success',
      data: {
        status: 'Discount Added to whole Sub-Category',
        discount: discount,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding discount for whole Sub-category`, 422));
  }
};
