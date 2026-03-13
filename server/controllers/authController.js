const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationOTPExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    const user = await User.create({
      name,
      email,
      password,
      verificationOTP,
      verificationOTPExpire,
    });

    if (user) {

      const message = `Your verification code for DevCollab is: ${verificationOTP}`;
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; text-align: center;">
          <h1 style="color: #4F46E5;">Verify Your Email</h1>
          <p style="color: #4B5563; font-size: 16px;">Thank you for joining DevCollab! Use the verification code below to confirm your account:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 12px; display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111827; margin: 20px 0; min-width: 200px;">
            ${verificationOTP}
          </div>
          <p style="color: #6B7280; font-size: 14px;">This code will expire in 30 minutes. If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #9CA3AF; font-size: 12px;">&copy; 2026 DevCollab. All rights reserved.</p>
        </div>
      `;

      try {
        await sendEmail({
          email: user.email,
          name: user.name,
          subject: 'DevCollab Email Verification Code',
          message,
          html,
        });

        res.status(201).json({
          success: true,
          message: 'Registration successful. Please check your email for the verification code.',
          email: user.email, // Send back email for OTP screen
        });
      } catch (err) {
        user.verificationOTP = undefined;
        user.verificationOTPExpire = undefined;
        await user.save();
        res.status(500);
        throw new Error('Email could not be sent');
      }
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};


// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      verificationOTP: otp,
      verificationOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        res.status(401);
        throw new Error('Please verify your email first');
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404);
      throw new Error('No user found with that email');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please go to: ${resetUrl}`;
    const html = `<h1>Password Reset</h1><p>Reset your password by clicking the link below:</p><a href="${resetUrl}">Reset Password</a>`;

    try {
      await sendEmail({
        email: user.email,
        name: user.name,
        subject: 'DevCollab Password Reset',
        message,
        html,
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired reset token');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Firebase Auth (Create/Login user)
// @route   POST /api/auth/firebase
// @access  Public
exports.firebaseAuth = async (req, res, next) => {
  try {
    const { firebaseUser } = req; // From middleware

    let user = await User.findOne({
      $or: [
        { firebaseId: firebaseUser.uid },
        { email: firebaseUser.email }
      ]
    });

    if (user) {
      if (!user.firebaseId) {
        user.firebaseId = firebaseUser.uid;
        await user.save();
      }
    } else {
      user = await User.create({
        name: firebaseUser.name || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        firebaseId: firebaseUser.uid,
        isVerified: !!firebaseUser.email_verified,
        profileImage: firebaseUser.picture || undefined
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};
