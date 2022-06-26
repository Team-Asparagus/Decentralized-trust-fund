// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

contract Factory {

    mapping (address => address[]) public creatorToTrust;

    function createTrust(address[] memory _beneficiaries, uint256 _interval, address _trustee) public {
        address trustContract = address(new DecentralizedTrustFund(_beneficiaries, msg.sender, _interval, _trustee));
        creatorToTrust[msg.sender].push(trustContract);
    }

    function getDeployedContracts() public view returns(address[] memory){
        return creatorToTrust[msg.sender];
    }
}

error DecentralizedTrustFund_MustDepositValidAmount();

contract DecentralizedTrustFund is KeeperCompatibleInterface {

    uint256 private trustBalance;
    uint256 private interval;
    address private owner;
    address private trustee;
    address[] private beneficiaries;
    mapping (address => uint256) private addressToAmount;
    mapping (address => bool) private isBeneficiaries;
    mapping (address => bool) private isTrustee;

    modifier onlyOwner(){
        require(msg.sender == owner, "Operation restricted to owner");
        _;
    }
    modifier onlyTrustee(){
        require(isTrustee[msg.sender] == true || msg.sender == owner, "Operation restricted to trustees");
        _;
    }
    event Deposited(address depositor, uint256 amount);

constructor(address[] memory _beneficiaries, address _owner, uint256 _interval, address _trustee){
    for(uint i = 0; i< _beneficiaries.length; i++){
        isBeneficiaries[_beneficiaries[i]] = true;
    }
        owner = _owner;
        trustee = _trustee;
        beneficiaries = _beneficiaries;
        interval = _interval;
        isTrustee[_trustee] = true;
    }

    function addTrustee(address _trustee) public onlyOwner {
        isTrustee[_trustee] = true;
    }
    function removeTrustee(address _trustee) public onlyOwner {
        isTrustee[_trustee] = false;
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
 
    function getOwner() public view returns(address) {
        return owner;
    }
    
    fallback() external payable {
        deposit();
    }

    receive() external payable {
        deposit();
    }


}