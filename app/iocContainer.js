const { IocContext } = require('power-di');
const { BuyCoinUseCase } = require('../core/use_case/buyCoinUseCase');
const { Infura } = require('../core/infura');

const container = IocContext.DefaultInstance;

container.register(BuyCoinUseCase, 'BuyCoinUseCase');
container.register(Infura, 'Infura');

module.exports = {
  container,
};
