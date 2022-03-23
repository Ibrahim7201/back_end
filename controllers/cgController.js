const Category = require('../models/categoriesModel');
const AppError = require('../utils/appError');

exports.addCategory = async (req, res, next) => {
  try {
    const { name, photo } = req.body;
    const category = await Category.create({
      name,
      photo,
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Category Added',
        category,
      },
    });
  } catch (err) {
    next(new AppError(`Error in adding Category!`, 404));
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const { name } = req.params;
    const cg = await Category.findOne({ name }).populate('subCategories', {
      name: 1,
    });
    res.status(201).json({
      status: 'success',
      data: {
        status: 'Category is Here!',
        category: cg,
      },
    });
  } catch (err) {
    next(new AppError(`Error in getting Category!`, 422));
  }
};
