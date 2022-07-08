const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
? describe.skip
: describe("Raffle unit tests", async function () {
    let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval, accounts
    beforeEach(async () => {
        accounts = await ethers.getSigners() // could also do with getNamedAccounts
        deployer = accounts[0]
        player = accounts[1]
        // const deployer = await getNamedAccounts()
        await deployments.fixture("all")
        // await deployments.fixture(["mocks", "raffle"])
        raffle = await ethers.getContract("Raffle", deployer)
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        // raffle = raffleContract.connect(player)
        raffleEntranceFee = await raffle.getEntranceFee()
        interval = await raffle.getInterval()
    })

    describe("constructor", async()=>{
        it("initializes raffle constructor", async()=>{
            const raffleState = await raffle.getRaffleState()
            const interval = await raffle.getInterval()

            assert.equal(raffleState.toString(), "0")
            assert.equal(interval.toString(), networkConfig[network.config.chainId]["keepersUpdateInterval"])
        })
    })


})