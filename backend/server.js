const app = require("./src/app");
const logger = require("./src/config/logger");
const { SERVER_MESSAGES } = require("./src/constants/messages");
const config = require("./src/config/config");

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(SERVER_MESSAGES.SERVER_RUNNING(PORT));
});
