/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
const { ethers } = require('ethers');
const {
  Route, Pool, Trade, SwapRouter,
} = require('@uniswap/v3-sdk');
const {
  CurrencyAmount, Token, TradeType, Percent,
} = require('@uniswap/sdk-core');
const { abi: IUniswapV3PoolABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json');
const { abi: QuoterABI } = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json');
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

    this.rpcProvider = new ethers.providers.JsonRpcProvider(
      process.env.infuraJsonRpcHttps + process.env.infuraProjectId,
    );
  }

  async getCoinBalanceOfWallet(address) {
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

  async transfer(buyCount) {
    try {
      const poolAddress = 'WRITE POOL ADDRESS';
      console.log(`transferOnUniswap : poolAddress : ${poolAddress}`);

      const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        this.rpcProvider,
      );

      const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

      const quoterContract = new ethers.Contract(
        quoterAddress, QuoterABI, this.rpcProvider,
      );

      // query the state and immutable variables of the pool
      const [immutables, state] = await Promise.all([
        this.getPoolImmutables(poolContract),
        this.getPoolState(poolContract),
      ]);

      // create instances of the Token object to represent the two tokens in the given pool
      const dai = new Token(
        parseInt(process.env.chainId, 10), immutables.token1, 18, 'DAI', 'Dai Stablecoin',
      );
      const uni = new Token(
        parseInt(process.env.chainId, 10), immutables.token0, 18, 'UNI', 'Uniswap',
      );

      console.log(`Dai : ${JSON.stringify(dai)}, Uni : ${JSON.stringify(uni)}`);

      // create an instance of the pool object for the given pool
      const poolExample = new Pool(
        uni,
        dai,
        immutables.fee,
        // note the description discrepancy:sqrtPriceX96 and sqrtRatioX96 are interchangable values
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick,
      );

      // assign an input amount for the swap
      const amountIn = ethers.utils.parseEther(String(buyCount));

      // call the quoter contract to determine the amount out of a swap, given an amount in
      const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        immutables.token1,
        immutables.token0,
        immutables.fee,
        amountIn.toString(),
        0,
      );

      console.log(`quotedAmountOut : ${quotedAmountOut.toString()}`);

      // create an instance of the route object in order to construct a trade object
      const swapRoute = new Route([poolExample], dai, uni);

      // create an unchecked trade instance
      const uncheckedTradeExample = await Trade.createUncheckedTrade({
        route: swapRoute,
        inputAmount: CurrencyAmount.fromRawAmount(dai, amountIn.toString()),
        outputAmount: CurrencyAmount.fromRawAmount(
          uni,
          quotedAmountOut.toString(),
        ),
        tradeType: TradeType.EXACT_INPUT,
      });

      const slippageTolerance = new Percent(1, 100);
      const recipient = process.env.publicKey;
      const date = new Date();
      const deadline = parseInt(date.setMinutes(date.getMinutes() + 30) / 1000, 10);
      const { calldata } = SwapRouter.swapCallParameters(uncheckedTradeExample, {
        slippageTolerance,
        recipient,
        deadline,
      });

      const result = await this.sendTransaction(process.env.uniswapV3RouterAddress, calldata);

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
