/* eslint-disable no-unused-expressions */
const { container } = require('../../app/iocContainer');

class BuyCoinUseCase {
  constructor(Infura = container.get('Infura')) {
    this.daiContractAddress = process.env.daiContractAddress;
    this.uniContractAddress = process.env.uniContractAddress;

    this.Infura = Infura;
    this.daiBalance;
    this.etherBalance;
  }

  isEnough() {
    return this.daiBalance > 0 && this.etherBalance > 0;
  }

  async execute() {
    try {
      this.daiBalance = await this.Infura.getCoinBalanceOfWallet(this.daiContractAddress);
      this.etherBalance = await this.Infura.getWalletBalance();

      const isEnough = this.isEnough(this.daiBalance, this.etherBalance);
      if (!isEnough) {
        return console.log('coin not enough');
      }

      console.log(`before buy daiBalance : ${this.daiBalance}, etherBalance ${this.etherBalance}`);

      await this.Infura.transfer(1);

      return true;
    } catch (error) {
      return console.error(error);
    }
  }
}

module.exports = {
  BuyCoinUseCase,
};
