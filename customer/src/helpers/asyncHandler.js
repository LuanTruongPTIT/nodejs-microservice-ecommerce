const asyncHandler = (fn) => {
  return (req, res, next) => {
    //   fn(req, res, next).catch((error) => {
    //     console.log(error);
    //     next(error);
    //   });
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
module.exports = {
  asyncHandler,
};
