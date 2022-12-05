const asyncHandler = (callbackFun) => async (req, res, next) => {
  try {
    callbackFun(req, res, next);
  } catch (error) {
    res.status(error.code).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = asyncHandler;
