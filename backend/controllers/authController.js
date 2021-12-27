const User = require("../models/user");
const catchAsynErrors = require("../middlewares/catchAsynErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const cloudinary = require('cloudinary');

exports.registerUser = catchAsynErrors(async(req, res, next) => {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    })

    const { name, email, password } = req.body;

    // const user = await User.create({
    //     name,
    //     email,
    //     password,
    //     avatar: {
    //         public_id: result.public_id,
    //         url: result.secure_url
    //     }
    // })

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "25646546735346",
            url: "https://scontent.fdac120-1.fna.fbcdn.net/v/t1.6435-9/82120930_2545604369096590_7241583266447228928_n.jpg?_nc_cat=109&cb=c578a115-c1c39920&ccb=1-5&_nc_sid=09cbfe&_nc_eui2=AeG98GSwhmskjbBTy95Jxts3cIfZlg998rBwh9mWD33ysJRQZX19WN2LVWFuYQf3D7dAelsDS5GNmCzQzIcNKlaE&_nc_ohc=WuMoiV-IAZkAX_kM5aN&tn=hebTZJUaGXEOALw7&_nc_ht=scontent.fdac120-1.fna&oh=9863fcf05b1835131da9c8696c69bf98&oe=61D6FEB5",
        },
    });

    sendToken(user, 200, res)
})

//Login User => /api/v1/login
exports.loginUser = catchAsynErrors(async(req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    //check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)

})

// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsynErrors(async(req, res, next) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler('User not foundd with this email', 404));
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    //create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is a follow:\n\n${resetUrl}\n\nIf you have not request this email, then ignor it.`;



    try {

        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})



// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsynErrors(async(req, res, next) => {

    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    console.log(user)

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400));
    }

    if (req.body.password !== req.body.confrimPassword) {
        return next(new ErrorHandler('Password donse not match', 400));
    }

    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res)


})


//Get Currently Logged in user details => /api/v1/me
exports.getUserProfile = catchAsynErrors(async(req, res, next) => {
    console.log(req);
    console.log(req.user.id);
    const user = await User.findById(req.user.id);

   res.status(200).json({
     success: true,
     user
   });

})

//update /chnage password => /api/v1/me
exports.updatePassword = catchAsynErrors(async(req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect.', 500));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

})

//Update user profile => /api/v1/me/update
exports.updateProfile = catchAsynErrors(async (req, res, next) => {

    const newuserData = {
        name: req.body.name,
        email: req.body.email,
    }

    //update avatat: TODO
    const user = await User.findByIdAndUpdate(req.user.id, newuserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
      success: true
    });
});

//Logout User => /api/v1/logout]
exports.logout = catchAsynErrors(async(req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })

})


//Admin Routes

//Get all Users  => /api/v1/admin/users
exports.allUsers = catchAsynErrors(async(req, res, next) => {

    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });

})

//Get User Details => /api/v1/admin/user/:id
exports.getUserDeatils = catchAsynErrors(async(req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        return next(
          new ErrorHandler(
            `User dose not found with id: ${req.params.id} `,
            500
          )
        );
    }

    res.status(200).json({
      success: true,
      user,
    });

})


//Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsynErrors(async (req, res, next) => {

    const newuserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    //update avatat: TODO
    const user = await User.findByIdAndUpdate(req.params.id, newuserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
      success: true
    });
});


//Get User Details => /api/v1/admin/user/:id
exports.DeleteUser = catchAsynErrors(async(req, res, next) => {

    const user = await User.findById(req.params.id);

    await user.remove();

    if(!user){
        return next(
          new ErrorHandler(
            `User dose not found with id: ${req.params.id} `,
            500
          )
        );
    }

    res.status(200).json({
      success: true,
      user,
    });

})