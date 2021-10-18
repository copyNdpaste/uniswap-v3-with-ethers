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
    uniswapV3RouterAddress,
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
  process.env.uniswapV3RouterAddress = uniswapV3RouterAddress;
  process.env.chainId = chainId;
  process.env.etherContractAddress = etherContractAddress;
  process.env.slackWebHookUrl = slackWebHookUrl;
};
