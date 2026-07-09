const asyncHandler = require("express-async-handler");
const { addReviewService } = require("../services/review.service");
const generalResponse = require("../utils/generalResponse");
const { getCreatedResponse } = require("../utils/response");
const { SUCCESS_MESSAGES } = require("../constants/messages");

const addReview = asyncHandler(async (req, res) => {
  const review = await addReviewService(req.user, req.params.id, req.body);
  return generalResponse(
    res,
    review,
    getCreatedResponse(SUCCESS_MESSAGES.REVIEW_ADDED),
  );
});

module.exports = {
  addReview,
};
