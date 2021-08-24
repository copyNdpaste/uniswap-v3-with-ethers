const { expect } = require('chai');
const { Infura } = require('../core/infura');

const { setConfig } = require('./setConfig');

setConfig();

describe('infura', () => {
  describe('getCoinBalanceOfWallet', () => {
    it('should return number when success', (done) => {
      const InfuraIns = new Infura();
      InfuraIns.getCoinBalanceOfWallet(process.env.daiContractAddress).then((result) => {
        expect(result).to.be.a('number');
        console.log(result);
        done();
      }).catch(done);
    });
  });

  describe('getWalletBalance', () => {
    it.only('should return number when success', (done) => {
      const InfuraIns = new Infura();
      InfuraIns.getWalletBalance().then((result) => {
        expect(result).to.be.a('number');
        console.log(result);
        done();
      }).catch(done);
    });
  });
});
