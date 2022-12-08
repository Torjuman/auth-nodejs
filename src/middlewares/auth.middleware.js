const User = require("../models/user.schema");
const JWT = require("jsonwebtoken");
const asyncHandler = require("../services/asyncHandler");
const CustomError = require("../utils/customError");
const { JWT_SECRET } = require("../configs");

const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("Not authorized to access this route", 401);
  }

  try {
    const decodedJwtPayload = JWT.verify(token, JWT_SECRET);
    req.user = await User.findById(decodedJwtPayload._id, "name email");
    next();
  } catch (error) {
    throw new CustomError("Not authorized to access this route", 401);
  }
});
