const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");
const isEmail = require("../utils/isEmail");
const User = require("../models/user.schema");
const cookieOptions = require("../utils/cookieOptions");

/******************************************************
 * @sign_in
 * @request_type POST
 * @route http://localhost:80/api/v1/auth/signin
 * @description user signin controller to sign in the user
 * @parameters email, password
 * @returns User Object
 ******************************************************/

const signIn = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("Fill up all the filed", 400);
  }
  if (!isEmail(email)) {
    throw new CustomError("Fill up email filed with correct format", 400);
  }
  email = String(email).replace(/\s+/g, "").toLowerCase();
  password = String(password).trim();

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (isPasswordMatch) {
    const token = user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }

  throw new CustomError("Invalid credentials", 400);
});

module.exports = signIn;
