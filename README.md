# Project Purpose
uniswap by using ethers, serverless, uniswap v3 sdk and core...

# Project Init
## create account
1. sign up [serverless](https://www.serverless.com/)
2. create aws account (you need account for serverless deployment)
## Install
1. node.js
2. [install serverless](https://www.serverless.com/framework/docs/getting-started/) `curl -o- -L https://slss.io/install | bash`
3. type `sls` in terminal and set project
4. `npm install`

# Config
```
module.exports.config = {
  prod: {
    infuraProjectId: '',
  },
  dev: {
    infuraProjectId: '', 
  },
}
```

# Run test
`npm run test`

if you want to run or skip specific test use only(), skip()
