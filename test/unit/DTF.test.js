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
        dai = await ethers.getContract("DappToken", deployer)
        // vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        // raffle = raffleContract.connect(player)
    })

    describe("Factory contract", async()=>{
        it("deploys new Trust fund contract and saves it to 'creatorToTrust' mapping of arrays", async()=>{
            const tx = await dtf.createTrust(["0xfb876653069cbfc67bCB7661564136ea670c247E", "0x6db649efE9CeDC4178e379565A5415A64F362ED0"], 600, "0x6db649efE9CeDC4178e379565A5415A64F362ED0", 1000, dai.address);
            await tx.wait();
            const trustAddress = await dtf.getDeployedContracts(deployer.address)
            assert(trustAddress[0]);
        })
    })
    describe("Constructor", async()=>{
        it("Correctly sets owner, beneficiaries, interval, isTrustee, amountWithdrawable values", async()=>{
            const tx = await dtf.createTrust(["0xfb876653069cbfc67bCB7661564136ea670c247E", "0x6db649efE9CeDC4178e379565A5415A64F362ED0"], 600, "0x6db649efE9CeDC4178e379565A5415A64F362ED0", 1000, dai.address);
            await tx.wait();
            const trustAddress = await dtf.getDeployedContracts(deployer.address)
            const trustContract = await ethers.getContractAt('DecentralizedTrustFund', trustAddress[0], deployer.address)
            const trustees = await trustContract.getTrustees()
            const beneficiaries = await trustContract.getBeneficiaries()
            const owner = await trustContract.getOwner()
            assert.equal(0x6db649efE9CeDC4178e379565A5415A64F362ED0, trustees[0])
            assert.equal(beneficiaries[0], 0xfb876653069cbfc67bCB7661564136ea670c247E)
            assert.equal(deployer.address, owner)
        })
    })
    describe("ERC20 Transactions", ()=>{
        it("Allows users to approve ERC20 tokens and transfer to DTF contract", async()=>{
            const tx = await dtf.createTrust(["0xfb876653069cbfc67bCB7661564136ea670c247E", "0x6db649efE9CeDC4178e379565A5415A64F362ED0"], 600, "0x6db649efE9CeDC4178e379565A5415A64F362ED0", 1000, dai.address);
            await tx.wait();
            const trustAddress = await dtf.getDeployedContracts(deployer.address)
            const trustContract = await ethers.getContractAt('DecentralizedTrustFund', trustAddress[0], deployer.address)
            // const success = await trustContract.approveDeposit(1000);
            
            const success = await dai.approve(trustAddress[0], 1000)
            await trustContract.depositDai(1000);
            const trustBalance = await dai.balanceOf(trustAddress[0])
            assert.equal(trustBalance, 1000)

        })

    })


})