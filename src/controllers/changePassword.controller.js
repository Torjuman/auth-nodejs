const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");
const User = require("../models/user.schema");
const cookieOptions = require("../utils/cookieOptions");

/******************************************************
 * @change_password
 * @request_type POST
 * @route http://localhost:80/api/v1/auth/password/change
 * @description User will submit oldPassword and newPassword then we will change the old password
 * @parameters oldPassword, newPassword, confirmNewPassword
 * @returns success message - email send
 ******************************************************/
const changePassword = asyncHandler(async (res, req, next) => {
  let { email } = req.user;
  if (!email) throw new CustomError("User was not found", 400);

  let { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new CustomError("All filed need to be fulfill", 400);
  }

  if (newPassword !== confirmNewPassword) {
    throw new CustomError(
      "New password and confirm password do not match",
      400
    );
  }

  const passwordUser = await User.findOne({ email });

  passwordUser.password = newPassword;

  await passwordUser.save();

  const token = passwordUser.getJwtToken();
  passwordUser.password = undefined;

  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    success: true,
    passwordUser,
  });
});

module.exports = changePassword;
