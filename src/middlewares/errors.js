module.exports = (err, req, res, next) => {
  return res.status(err.httpStatusCode).json(err);
}