const generalResponse = (res, result, Status) => {
  const response = {
    data: result,
    status: Status,
    message: Status?.message,
  };
  return res.status(Status?.statusCode || 200).json(response);
};

module.exports = generalResponse;
