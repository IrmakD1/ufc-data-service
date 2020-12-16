const { setLogInfo } = require('./log-info');
const logger = require('./logger');

logger.setLogInfo = setLogInfo;
logger.logger = logger;
module.exports = logger;
