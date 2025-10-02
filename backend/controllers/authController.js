const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
  next();
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select(
      '+password'
    );

    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      return res.status(401).json({
        status: 'failed',
        message: 'incorrect email or password',
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
    });
  }
  next();
};

exports.protect = async (req, res, next) => {
  // 1, Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      status: 'failed',
      message:
        'you are not logged in! please log in to get access',
    });
  }
  //2, verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //3, check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: 'failed',
      message:
        'the user belonging to this token does no longer exist',
    });
  }
  //4, check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: 'failed',
      message:
        'user recently changed password! please log in again',
    });
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'failed',
        message:
          'you do not have permission to perform this action',
      });
    }
    next();
  };
};
