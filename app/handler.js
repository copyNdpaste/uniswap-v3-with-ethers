const { BuyCoinUseCase } = require('../core/use_case/buyCoinUseCase');

module.exports.run = () => {
  const usecase = new BuyCoinUseCase();
  usecase.execute();
};
