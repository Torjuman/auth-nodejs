const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");
const crypto = require("crypto");
const User = require("../models/user.schema");
const cookieOptions = require("../utils/cookieOptions");

/******************************************************
 * @reset_password
 * @request_type POST
 * @route http://localhost:80/api/v1/auth/password/reset/:resetToken
 * @description User will be able to reset password based on url token
 * @parameters token from url, password and confirmpass
 * @returns User object
 ******************************************************/

const resetPassword = asyncHandler(async (req, res, next) => {
  let { resetToken } = req.params;
  let { password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    throw new CustomError("password and confirm password doesn't match", 400);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) throw new CustomError("Password token invalid or expired", 400);

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  const token = user.getJwtToken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = resetPassword;
