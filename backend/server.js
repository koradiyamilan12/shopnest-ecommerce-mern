const app = require("./src/app");
const logger = require("./src/config/logger");
const { SERVER_MESSAGES } = require("./src/constants/messages");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(SERVER_MESSAGES.SERVER_RUNNING(PORT));
});
