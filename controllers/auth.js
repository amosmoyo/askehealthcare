/* eslint-disable no-undef */
const asyncHandler = require('../middlewares/async');
// eslint-disable-next-line no-unused-vars
const ErrorResponse = require('../utils/errResponse');
const User = require('../models/User');
const crypto = require('crypto');

const sendEmail = require('../utils/mail')

// @desc      Register user
// @route     POST /api/v1/users/register
// @access    Public
// eslint-disable-next-line no-unused-vars
exports.register = asyncHandler(async( req, res, next) => {

  const {firstName, lastName, email, password } = req.body;

  const user = await User.create({
    firstName, lastName, email, password
  })

  sendTokenResponse(user, 200, res)

});

// @desc      Login user
// @route     POST /api/v1/users/login
// @access    Public
exports.login = asyncHandler(async(req, res, next) => {
  const {email, password} = req.body;

  // validate email and password
  if(!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400))
  }

  // check for user
  const user = await User.findOne({email}).select('+password');

  if(!user) {
    // return new ErrorResponse('Invalid cresidential', 401)
    return res.status(401).json({
      success: false,
      message: 'Invalid cresidential try again'
    })
  }

    // compare passwords
  const compare = await user.comparePass(password);

  if(!compare) {
    // return new ErrorResponse('Invalid cresidential', 401)
    return res.status(401).json({
      success: false,
      message: 'Invalid cresidential try again'
    })
  }

  console.log(user._id);

  sendTokenResponse(user, 200, res)
})

// @desc      Get current logged in user
// @route     GET /api/v1/auth/account
// @access    Private
// eslint-disable-next-line no-unused-vars
exports.account = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
// eslint-disable-next-line no-unused-vars
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName:req.body.lastName,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.comparePass(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});


// @desc Forgot email
// @route POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler( async (req, res, next) => {
  const user = await User.findOne({email: req.body.email})

  if(!user) {
    return next(
      new ErrorResponse(`Account can not be found ${req.body.email}`, 404)
    )
  }

  const resetToken = await user.getResetPasswordToken();

  console.log(resetToken);

  await user.save({validateBeforeSave: false})

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  const text = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({ email: user.email, subject: 'You password reset token (valid for 10 min)', text });
    console.log('monica')

    res.status(200).json({
        success: true,
        message: 'You can confirm your email a password reset token has been send'
    });

  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(error.message)

    return res.status(500).json({
      success: false,
      message: error
    });
  }


  res.status(200).json({
    success: true,
    user
  })

})

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getJWT();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};