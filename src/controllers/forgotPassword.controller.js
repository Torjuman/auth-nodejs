const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");
const User = require("../models/user.schema");
const mailHelper = require("../utils/mailHelper");

/******************************************************
 * @forgot_password
 * @request_type POST
 * @route http://localhost:80/api/v1/auth/password/forgot
 * @description User will submit an email and we will generate a token
 * @parameters email
 * @returns success message - email send
 ******************************************************/

const forgotPassword = asyncHandler(async (req, res, next) => {
  let { email } = req.body;

  if (!email || email === "") throw new CustomError("Invalid email!", 400);

  const user = await User.findOne({ email });

  if (!user) throw new CustomError("User not found", 400);

  const resetToken = user.generateForgetPasswordTokenExpiry();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocal}://${req.get(
    "host"
  )}/api/v1/auth/password/reset/${resetToken}`;

  const text = `\n\n Your password reset url is ${resetUrl}`;

  try {
    await mailHelper({
      email: user.email,
      subject: "Email for reset password",
      text: text,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (err) {
    // Role back - clear all user filed which was about to save
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new CustomError(err.message || "Email sent failure", 500);
  }
});

module.exports = forgotPassword;
