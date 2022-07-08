const { network, run } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    // VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let daiAddress

    // const Factory = await ethers.getContract("Factory")
    if (chainId == 31337) {
        // const DappToken = await ethers.getContract("DappToken")
        // daiAddress = DappToken.address
        
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
    } else {
        daiAddress = networkConfig[chainId]["daiAddress"]
    }

    const arguments = []

    const factory = await deploy("Factory", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    
})
    function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
    }
    if (!developmentChains.includes(network.name) && process.env.POLYGONSCAN_KEY) {
    console.log("Sleeping.....");
    await sleep(50000);
    log("Verifying...")
    await verify(factory.address, arguments)
}

// log("Run Price Feed contract with command:")
// const networkName = network.name == "hardhat" ? "localhost" : network.name
// log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
log("----------------------------------------------------")
}
module.exports.tags = ["all", "dtf"]