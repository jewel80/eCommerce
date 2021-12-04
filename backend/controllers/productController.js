const Product = require('../models/product');


//create new product => /api/v1/product/new
exports.newProduct = async(req, res, next) => {
    // console.log(JSON.parse(JSON.stringify(req.body)));
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
}


//Get All Product => /api/v1/admin/products
exports.getProducts = async(req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        count: products.length,
        products
    })
}


//Get Single Product => /api/v1/product/:id
exports.getSingleProduct = async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'product not found'
        })
    }
    res.status(200).json({
        success: true,
        product
    })
}


//Update Product => /api/v1/admin/product/:id
exports.updateProduct = async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'product not found'
        })
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
}


//Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'product not found'
        })
    }

    await product.remove()

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })
}