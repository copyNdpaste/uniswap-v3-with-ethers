const { config } = require('../config/config');

module.exports.setConfig = () => {
  const { debug } = config;
  const {
    infuraProjectId,
    infuraProjectSecret,
    daiContractAddress,
    network,
    privateKey,
    uniContractAddress,
    routerAddress,
    chainId,
    etherContractAddress,
    slackWebHookUrl,
  } = debug;

  process.env.infuraProjectId = infuraProjectId;
  process.env.infuraProjectSecret = infuraProjectSecret;
  process.env.network = network;
  process.env.daiContractAddress = daiContractAddress;
  process.env.privateKey = privateKey;
  process.env.uniContractAddress = uniContractAddress;
  process.env.routerAddress = routerAddress;
  process.env.chainId = chainId;
  process.env.etherContractAddress = etherContractAddress;
  process.env.slackWebHookUrl = slackWebHookUrl;
};
