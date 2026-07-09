const asyncHandler = require("express-async-handler");
const { getAdminStatsService } = require("../services/analytics.service");
const generalResponse = require("../utils/generalResponse");
const { getOkResponse } = require("../utils/response");
const { SUCCESS_MESSAGES } = require("../constants/messages");

const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await getAdminStatsService();
  return generalResponse(
    res,
    stats,
    getOkResponse(SUCCESS_MESSAGES.ADMIN_STATS_FETCHED),
  );
});

module.exports = { getAdminStats };
