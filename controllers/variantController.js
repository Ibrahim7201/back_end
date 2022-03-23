const Variant = require('../models/variantModel');
const SubCategory = require('../models/subCategoriesModel');
const AppError = require('../utils/appError');

exports.addVariant = async (req, res, next) => {
  try {
    const { name, options } = req.body;
    const variant = await Variant.create({
      name,
      options,
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Variant Created',
        variant,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding variant`, 422));
  }
};

exports.showVariants = async (req, res, next) => {
  try {
    const { subCategory } = req.body;
    const scg = await SubCategory.findOne({ name: subCategory }).populate(
      'variants'
    );
    const { variants } = scg;
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Variants are here',
        variants,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting variants`, 422));
  }
};
