const asyncHandler = require("../utils/mailHelper");
const CustomError = require("../utils/customError");
const isEmail = require("../utils/isEmail");
const User = require("../models/user.schema");
const cookieOptions = require("../utils/cookieOptions");

/******************************************************
 * @sign_up
 * @request_type POST
 * @route http://localhost:80/api/v1/auth/signup
 * @description user signup controller to create new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/

const signUp = asyncHandler(async (req, res, next) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError("Fill up all the filed", 400);
  }

  if (!isEmail(email)) {
    throw new CustomError("Fill up email filed with correct format", 400);
  }

  name = String(name).replace(/\s+/g, " ").trim();
  email = String(email).replace(/\s+/g, "").toLowerCase();
  password = String(password).trim();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("The user already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();
  console.log(user);
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({ success: true, token, user });
});

module.exports = signUp;
