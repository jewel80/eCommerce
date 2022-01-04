const Product = require('../models/product');

const catchAsynErrors = require('../middlewares/catchAsynErrors')
const ErrorHandler = require('../utils/errorHandler')
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

// Create new product   =>   /api/v1/admin/product/new
// exports.newProduct = catchAsynErrors(async (req, res, next) => {

//     // console.log('===========S============');
//     // console.log(req.body);
//     // console.log('============E===========');

//     let images = []
//     if (typeof req.body.images === 'string') {
//         images.push(req.body.images)
//     } else {
//         images = req.body.images
//     }

//     let imagesLinks = [];

//     for (let i = 0; i < images.length; i++) {
//         const result = await cloudinary.v2.uploader.upload(images[i], {
//             folder: 'products'
//         });

//         imagesLinks.push({
//             public_id: result.public_id,
//             url: result.secure_url
//         })
//     }

//     req.body.images = imagesLinks
//     req.body.user = req.user.id;

//     const product = await Product.create(req.body);

//     res.status(201).json({
//         success: true,
//         product
//     })
// })


// create new product => /api/v1/product/new
exports.newProduct = catchAsynErrors(async(req, res, next) => {

    req.body.user = req.user.id;

    const apiFeatures = new APIFeatures(Product.find(), )
    const product = await Product.create(req.body)
    res.status(201).json({
        // success: true,
        product
    })
})

//Get all Admin Product => /api/v1/admin/products..
exports.getAdminProducts = catchAsynErrors(async(req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
      success: true,
      products
    });
})


//Get All Product => /api/v1/admin/products backup
// exports.getProducts = catchAsynErrors(async(req, res, next) => {

//     const resPerPage = 8;
//     const productsCount = await Product.countDocuments();

//     const apiFeatures = new APIFeatures(Product.find(), req.query)
//         .seacrh()
//         .filter()
//         .pagenation(resPerPage);

//     const products = await apiFeatures.query;

//     res.status(200).json({
//       success: true,
//       // count: products.length,
//       productsCount,
//       resPerPage,
//       products,
//     });
// })

exports.getProducts = catchAsynErrors(async(req, res, next) => {

    const resPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .seacrh()
        .filter()
        .pagenation(resPerPage);

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    res.status(200).json({
      success: true,
      productsCount,
      resPerPage,
      filteredProductsCount,
      products,
    });
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


//Create new review => /api/v1/admin/product/:id
exports.createProductReview = catchAsynErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})



//Get Product Reviews => /api/v1/reviews
exports.getProductReviews = catchAsynErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


//Get Product Reviews => /api/v1/reviews
exports.deleteReview = catchAsynErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    const numberOfReviews = reviews.length;
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    // console.log(req.query.id);
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numberOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})