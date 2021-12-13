const Order = require("../models/order");
const Product = require("../models/product");

const catchAsynErrors = require("../middlewares/catchAsynErrors");
const ErrorHandler = require("../utils/errorHandler");


//create a new Order => /api/v1/order/new
exports.newOrder = catchAsynErrors(async(req, res, next) => {

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
exports.myOrders = catchAsynErrors(async(req, res, next) => {

     console.log(req);


    const order = await Order.find({user: req.user.id});

    console.log(order);

    res.status(200).json({
        success: true,
        order
    })
})