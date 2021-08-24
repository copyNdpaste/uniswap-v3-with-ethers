/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
const { ethers } = require('ethers');
const {
  Pool, Trade, Route, FeeAmount, encodeSqrtRatioX96, TickMath,
  nearestUsableTick, TICK_SPACINGS, SwapRouter,
} = require('@uniswap/v3-sdk');
const {
  Token, Percent, CurrencyAmount, TradeType,
} = require('@uniswap/sdk-core');
const erc20Abi = require('../erc20Abi.json');

class Infura {
  constructor() {
    this.provider = new ethers.providers.InfuraProvider(process.env.network, {
      projectId: process.env.infuraProjectId,
      projectSecret: process.env.infuraProjectSecret,
    });
    this.signer = new ethers.Wallet(process.env.privateKey, this.provider);
    this.walletAddress = this.signer.address;
    this.readOnlyContract;
  }

  async getCoinBalanceOfWallet(address) {
    // contract instance 생성, walletaddress 넣어서 개수 가져오기
    try {
      this.readOnlyContract = new ethers.Contract(address, erc20Abi, this.provider);
      let balance = await this.readOnlyContract.balanceOf(this.walletAddress);
      balance = ethers.utils.formatEther(balance);
      balance = parseFloat(balance);

      return balance;
    } catch (error) {
      return console.error(error);
    }
  }

  async getWalletBalance() {
    let balance = await this.provider.getBalance(this.walletAddress);
    balance = ethers.utils.formatEther(balance);
    balance = parseFloat(balance);

    return balance;
  }

  makePool(token0, token1) {
    const feeAmount = FeeAmount.MEDIUM;
    const sqrtRatioX96 = encodeSqrtRatioX96(1, 1);
    const liquidity = 1_000_000;
    return new Pool(
      token0, token1, feeAmount, sqrtRatioX96, liquidity, TickMath.getTickAtSqrtRatio(sqrtRatioX96),
      [
        {
          index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
          liquidityNet: liquidity,
          liquidityGross: liquidity,
        },
        {
          index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
          liquidityNet: -liquidity,
          liquidityGross: liquidity,
        },
      ],
    );
  }

  async sendTransaction(routerAddress, data) {
    try {
      return await this.signer.sendTransaction({
        to: routerAddress,
        data,
      });
    } catch (error) {
      return console.error(error);
    }
  }

  async transfer(token0Address, token1Address, buyCount) {
    try {
      const chainId = parseInt(process.env.chainId, 10);
      const decimals = 18;
      const token0 = new Token(chainId, token0Address, decimals);
      const token1 = new Token(chainId, token1Address, decimals);

      const slippageTolerance = new Percent(1, 100);
      const recipient = this.walletAddress;
      const date = new Date();
      const deadline = date.setMinutes(date.getMinutes() + 30);

      const count = ethers.utils.parseUnits(String(buyCount), 18);
      const pool = this.makePool(token0, token1);
      const trade = await Trade.fromRoute(
        new Route([pool], token0, token1),
        CurrencyAmount.fromRawAmount(token0, count),
        TradeType.EXACT_INPUT,
      );
      const { calldata } = SwapRouter.swapCallParameters(trade, {
        slippageTolerance,
        recipient,
        deadline,
      });

      const result = await this.sendTransaction(process.env.routerAddress, calldata);

      console.log(`transfer finish. result: ${JSON.stringify(result)}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = {
  Infura,
};
