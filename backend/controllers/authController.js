const User = require("../models/user");
const catchAsynErrors = require("../middlewares/catchAsynErrors");
const ErrorHandler = require("../utils/errorHandler");
// const APIFeatures = require("../utils/apiFeatures");


exports.registerUser = catchAsynErrors( async (req, res, next) =>{
    const {name, email, password} = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "25646546735346",
        url: "https://scontent.fdac120-1.fna.fbcdn.net/v/t1.6435-9/82120930_2545604369096590_7241583266447228928_n.jpg?_nc_cat=109&cb=c578a115-c1c39920&ccb=1-5&_nc_sid=09cbfe&_nc_eui2=AeG98GSwhmskjbBTy95Jxts3cIfZlg998rBwh9mWD33ysJRQZX19WN2LVWFuYQf3D7dAelsDS5GNmCzQzIcNKlaE&_nc_ohc=WuMoiV-IAZkAX_kM5aN&tn=hebTZJUaGXEOALw7&_nc_ht=scontent.fdac120-1.fna&oh=9863fcf05b1835131da9c8696c69bf98&oe=61D6FEB5",
      },
    });

    const token = user.getJwtToken();

    res.status(201).json({
      success: true,
      token
    });
})