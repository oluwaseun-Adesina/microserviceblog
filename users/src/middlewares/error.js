class AppError extends Error {
  constructor(status_code, message) {
    super();
    this.status_code = status_code;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const { status_code = 500, message } = err;
  res.status(status_code).json({
    status: "error",
    status_code,
    message,
  });
};

module.exports = {
  AppError,
  handleError,
};
