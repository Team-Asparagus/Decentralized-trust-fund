const { ethers } = require("hardhat");
// require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");
// const { FEE, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH } = require("../constants");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so randomWinnerGame here is a factory for instances of our RandomWinnerGame contract.
  */
  const FactoryContract = await ethers.getContractFactory("Factory");
  // deploy the contract


  const factory = await  FactoryContract.deploy();
  await  factory.deployed();
  const DTF = await factory.createTrust(["0xfb876653069cbfc67bCB7661564136ea670c247E", "0x6db649efE9CeDC4178e379565A5415A64F362ED0"], 600, "0x6db649efE9CeDC4178e379565A5415A64F362ED0", 1000);
  await DTF.wait();
  const dtfAddress = await factory.getDeployedContracts()
  console.log(dtfAddress[0]);

  // print the address of the deployed contract
  console.log(
    "Verify Contract Address:",
    factory.address
  );

  // // Wait for etherscan to notice that the contract has been deployed
  
  // // Verify the contract after deploying
  // await hre.run("verify:verify", {
    //   address: deployedRandomWinnerGameContract.address,
    //   constructorArguments: [VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, FEE],
    // });
  }
  
  const arguments = [["0xfb876653069cbfc67bCB7661564136ea670c247E", "0x6db649efE9CeDC4178e379565A5415A64F362ED0"], deployer, 600, "0x6db649efE9CeDC4178e379565A5415A64F362ED0", 1000]

    const decentralizedTrustFund = await deploy("DecentralizedTrustFund", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    
    })
  // function sleep(ms) {
    //   return new Promise((resolve) => setTimeout(resolve, ms));
    // }
    // await sleep(50000);
    // console.log("Sleeping.....");

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
