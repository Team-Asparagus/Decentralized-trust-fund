// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

contract Factory {

    mapping (address => address[]) public creatorToTrust;

    function createTrust(address[] memory _beneficiaries, uint256 _interval) public {
        address trustContract = address(new DecentralizedTrustFund(_beneficiaries, msg.sender, _interval));
        creatorToTrust[msg.sender].push(trustContract);
    }

    function getDeployedContracts() public view returns(address[] memory){
        return creatorToTrust[msg.sender];
    }
}

error DecentralizedTrustFund_MustDepositValidAmount();

contract DecentralizedTrustFund is KeeperCompatibleInterface {

    mapping (address => uint256) private addressToAmount;
    uint256 private trustBalance;
    uint256 private interval;
    address private owner;
    address[] private beneficiaries;

    event Deposited(address depositor, uint256 amount);

    constructor(address[] memory _beneficiaries, address _owner, uint256 _interval){
        owner = _owner;
        beneficiaries = _beneficiaries;
        interval = _interval;
    }

    function checkUpkeep(bytes memory /* checkData */ ) public view override returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        ){

        }
    
    function performUpkeep(bytes calldata /* performData */) external override {

    }

    function deposit() public payable {
        if(msg.value == 0){
            revert DecentralizedTrustFund_MustDepositValidAmount();
        }
        trustBalance += msg.value;
        addressToAmount[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    fallback() external payable {
        deposit();
    }

    receive() external payable {
        deposit();
    }
}