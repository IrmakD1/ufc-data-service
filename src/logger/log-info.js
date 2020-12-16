const readPkg = require('read-pkg');

const setLogInfo = defaultVals => {
  const { version, name } = readPkg.sync();
  let logInfo = {
    appId: `${name}:${version}` || '----',
    env: process.env.CBAAS_ENV || '----',
  };
  if (defaultVals)
    logInfo = {
      channel: '----',
      nodeIp: '----',
      nodeId: '----',
      component: '----',
      cid: '----',
      businessAction: '----',
      customer: '----',
      internalUser: '----',
      reqIp: '----',
      reqUrl: '----',
      eventClass: '----',
      eventId: '----',
      userRole: '----',
      partyIdUser: '----',
      httpVerb: '----',
      statusCode: '----',
      brand: '----',
      product: '----',
      protocol: '----',
      httpVersion: '----',
      userAgent: '----',
      convId: '____',
      ...logInfo,
    };
  global.logInfo = logInfo;
};

module.exports = { setLogInfo };
