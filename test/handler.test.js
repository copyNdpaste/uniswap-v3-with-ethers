const { run } = require('../app/handler');
const { setConfig } = require('./setConfig');

setConfig();

describe('handler', () => {
  describe('run', () => {
    it('should run when call', () => {
      run();
    });
  });
});
