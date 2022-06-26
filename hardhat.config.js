require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
 const MAINNET_RPC_URL =
 process.env.MAINNET_RPC_URL ||
 process.env.ALCHEMY_MAINNET_RPC_URL ||
 "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const RINKEBY_RPC_URL =
 process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
const KOVAN_RPC_URL = process.env.KOVAN_RPC_URL || "https://eth-kovan.alchemyapi.io/v2/your-api-key"
const POLYGON_MAINNET_RPC_URL =
 process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x"
// optional
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "your mnemonic"

module.exports = {
  // solidity: "0.8.8",
  solidity: {
    compilers: [{ version: "0.8.7"}, { version: "0.6.6"}]
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
        // // If you want to do some forking, uncomment this
        // forking: {
        //   url: MAINNET_RPC_URL
        // }
        chainId: 31337,
    },
    localhost: {
        chainId: 31337,
    },
    kovan: {
        url: KOVAN_RPC_URL,
        accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        //accounts: {
        //     mnemonic: MNEMONIC,
        // },
        saveDeployments: true,
        chainId: 42,
    },
    rinkeby: {
        url: RINKEBY_RPC_URL,
        accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        //   accounts: {
        //     mnemonic: MNEMONIC,
        //   },
        saveDeployments: true,
        chainId: 4,
    },
    mainnet: {
        url: MAINNET_RPC_URL,
        accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        //   accounts: {
        //     mnemonic: MNEMONIC,
        //   },
        saveDeployments: true,
        chainId: 1,
    },
    polygon: {
        url: POLYGON_MAINNET_RPC_URL,
        accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        saveDeployments: true,
        chainId: 137,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH"
},
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
        default: 1,
    },
  },
  mocha: {
    timeout: 600000,
  }
};