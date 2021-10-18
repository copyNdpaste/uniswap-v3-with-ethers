const { expect } = require('chai');
const { describe, it } = require('mocha');
const { BuyCoinUseCase } = require('../core/use_case/buyCoinUseCase');
const { setConfig } = require('./setConfig');

setConfig();

describe('BuyCoinUseCase', () => {
  describe('execute', () => {
    it('should return true when success', (done) => {
      const usecase = new BuyCoinUseCase();
      usecase.execute().then((result) => {
        expect(result).to.be.eq(true);
        done();
      }).catch(done);
    });
  });
});
