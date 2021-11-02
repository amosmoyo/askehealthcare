/* eslint-disable no-undef */
const asyncHandler = require('../middlewares/async');
// eslint-disable-next-line no-unused-vars
const ErrorResponse = require('../utils/errResponse');
const User = require('../models/User');

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