const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
? describe.skip
: describe("Decentralized Trust Fund tests", async function () {
    let raffle, deployer, accounts
    beforeEach(async () => {
        accounts = await ethers.getSigners() // could also do with getNamedAccounts
        deployer = accounts[0]
        // player = accounts[1]
        await deployments.fixture("all")
        // await deployments.fixture(["mocks", "raffle"])
        dtf = await ethers.getContract("Factory", deployer)
        // vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        // raffle = raffleContract.connect(player)
    })

    describe("Factory contract", async()=>{
        it("deploys new Trust fund contract and saves it to 'creatorToTrust' mapping of arrays", async()=>{
            const tx = await dtf.createTrust(["0xfb876653069cbfc67bCB7661564136ea670c247E", "0x6db649efE9CeDC4178e379565A5415A64F362ED0"], 600, "0x6db649efE9CeDC4178e379565A5415A64F362ED0", 1000);
            await tx.wait();
            const trustAddress = await dtf.getDeployedContracts(deployer.address)
            assert(trustAddress);
        })
    })


})