const Order = require("../models/order");
const Product = require("../models/product");

const catchAsynErrors = require("../middlewares/catchAsynErrors");
const ErrorHandler = require("../utils/errorHandler");


//create a new Order => /api/v1/order/new
exports.newOrder = catchAsynErrors(async(req, res, next) => {

    // console.log( req.body);

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(200).json({
        success: true,
        order
    });
})


//Get Single order => /api/v1/order/:id
exports.getSingleOrder = catchAsynErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
        return next(new ErrorHandler('Order not found', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})


//Get logged in user orders => /api/v1/orders/me
// exports.myOrders = catchAsynErrors(async(req, res, next) => {
//   const order = await Order.find({ user: req.user.id });

//   res.status(200).json({
//     success: true,
//     orders,
//   });

//   console.log( req.user.id);
// })

exports.myOrders = catchAsynErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});


//Get all orders -ADMIN => /api/v1/admin/orders
exports.allOrders = catchAsynErrors(async(req, res, next) => {

    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Update / process order -ADMIN => /api/v1/admin/orders
exports.updateOrder = catchAsynErrors(async(req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,
        order.deliveredAt = Date.now()

    await order.save();

    res.status(200).json({
        success: true,
        order
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}


//Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsynErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler('Order not found', 404))
    }

    await order.remove()

    res.status(200).json({
        success: true
    })
})