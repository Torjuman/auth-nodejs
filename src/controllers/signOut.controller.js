const asyncHandler = require("../services/asyncHandler");

/******************************************************
 * @sign_out
 * @request_type GET
 * @route http://localhost:80/api/v1/auth/signout
 * @description  User logout bby clearing user cookies
 * @parameters
 * @returns success message
 ******************************************************/

const signOut = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "You are sign out",
  });
});

module.exports = signOut;
