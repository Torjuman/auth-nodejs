const asyncHandler = require("../services/asyncHandler");

/******************************************************
 * @get_profile
 * @request_type GET
 * @route http://localhost:80/api/v1/auth/profile
 * @description check for token and populate req.user
 * @parameters
 * @returns User object
 ******************************************************/

const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user) throw new CustomError("User did not find", 400);

  res.status(200).json({ success: true, user });
});

module.exports = getProfile;
