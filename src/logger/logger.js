const uuid = require('uuid/v1');
const winston = require('winston');
const _ = require('lodash');

const { LOG_LEVEL = 'info' } = process.env;

const cbaasFormat = (
  {
    channel,
    nodeIp,
    nodeId,
    component,
    appId,
    cid,
    businessAction,
    customer,
    reqIp,
    reqUrl,
    eventClass = 'LOG',
    eventId,
    userRole,
    partyIdUser,
    httpVerb,
    statusCode,
    env,
    brand,
    product,
    protocol,
    httpVersion,
    userAgent,
    convId,
  },
  { className, stackTrace, exceptionType, responseTime, variant }
) =>
  winston.format.printf(info =>
    JSON.stringify({
      HEAD: {
        TS: _.get(info, 'timestamp'),
        CH: channel,
        NIP: nodeIp,
        NID: nodeId,
        CMP: component,
        APP: appId,
        CID: cid,
        BTR: businessAction,
        CUST: customer,
        RIP: reqIp,
        REQ: reqUrl,
        EVL: _.get(info, 'level').toUpperCase(),
        EVC: eventClass,
        EID: eventId,
        UR: userRole,
        PID: partyIdUser,
        METH: httpVerb,
        RSST: statusCode,
        ENV: env,
        BRAND: brand,
        PRODUCT: product,
        PROTOCOL: protocol,
        HTTPVERSION: httpVersion,
        USERAGENT: userAgent,
        CONVID: convId,
      },
      APP: {
        CLS: className,
        MSG: _.get(info, 'message'),
        DUMP: stackTrace,
        ETYP: exceptionType,
        RSNS: responseTime,
        VARIANT: variant,
      },
    })
  );

const logger = (cid = uuid(), header = {}, app = {}) => {
  const log = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
      cbaasFormat({ cid, ...header }, app)
    ),
    transports: [new winston.transports.Console({})],
  });
  log.cid = cid;
  return log;
};

module.exports = logger;
