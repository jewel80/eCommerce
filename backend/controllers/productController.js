const Product = require('../models/product');

const catchAsynErrors = require('../middlewares/catchAsynErrors')
const ErrorHandler = require('../utils/errorHandler')
const APIFeatures = require('../utils/apiFeatures')


//create new product => /api/v1/product/new
exports.newProduct = catchAsynErrors(async(req, res, next) => {

    req.body.user = req.user.id;

    const apiFeatures = new APIFeatures(Product.find(), )
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})


//Get All Product => /api/v1/admin/products
exports.getProducts = catchAsynErrors(async(req, res, next) => {

    const resPerPage = 3;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .seacrh()
        .filter()
        .pagenation(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
})


//Get Single Product => /api/v1/product/:id
exports.getSingleProduct = catchAsynErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})


//Update Product => /api/v1/admin/product/:id
exports.updateProduct = catchAsynErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})


//Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsynErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404))
    }

    await product.remove()

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })
})