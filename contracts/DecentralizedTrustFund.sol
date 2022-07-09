// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Factory {

    mapping (address => address[]) public creatorToTrust;
    event TrustDeployed(address creator, address trustAddress);

    function createTrust(address[] memory _beneficiaries, uint256 _interval, address _trustee, uint _amountWithdrawable, address _daiTokenAddress) public {
        address trustContract = address(new DecentralizedTrustFund(_beneficiaries, msg.sender, _interval, _trustee, _amountWithdrawable, _daiTokenAddress));
        creatorToTrust[msg.sender].push(trustContract);
        emit TrustDeployed(msg.sender, trustContract);
    }

    function getDeployedContracts(address _owner) public view returns(address[] memory){
        return creatorToTrust[_owner];
    }

}

error DecentralizedTrustFund_MustDepositValidAmount();
error DecentralizedTrustFund_SufficentTimeNotElapsed();

contract DecentralizedTrustFund is KeeperCompatibleInterface {
    address[] private trustees;
    uint256 private ethBalance;
    uint256 private daiBalance;
    uint256 private interval;
    uint256 private amountWithdrawable;
    address private owner;
    address[] private beneficiaries;
    address[2] whiteLists;
    mapping (address => uint256) private addressToAmount;
    mapping (address => bool) private isBeneficiaries;
    mapping (address => bool) private isTrustee;
    mapping (address => uint256) private lastTimestamp;
    mapping (address => bool) private isWhiteList;
    IERC20 private daiToken;
    /// @dev hardcoded stable coin addresses to be refactored

    modifier onlyOwner(){
        require(msg.sender == owner, "Operation restricted to owner");
        _;
    }
    modifier onlyTrustee(){
        require(isTrustee[msg.sender] == true || msg.sender == owner, "Operation restricted to trustees");
        _;
    }
    event Deposited(address depositor, uint256 amount);



constructor(address[] memory _beneficiaries, address _owner, uint256 _interval, address _trustee, uint256 _amountWithdrawable, address _daiTokenAddress){
    for(uint i = 0; i< _beneficiaries.length; i++){
        isBeneficiaries[_beneficiaries[i]] = true;
        lastTimestamp[_beneficiaries[i]] = block.timestamp;
    }
    whiteLists = [0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253, 0xd393b1E02Da9831EF419E22eA105aae4C47E1253];
    for(uint i = 0; i< whiteLists.length; i++){
        isWhiteList[whiteLists[i]] = true;
    }
        owner = _owner;
        beneficiaries = _beneficiaries;
        interval = _interval;
        isTrustee[_trustee] = true;
        trustees.push(_trustee);
        amountWithdrawable = _amountWithdrawable;
        daiToken = IERC20(_daiTokenAddress);

    }

    function approveDeposit(uint _amount) public returns(bool success) {
       success = daiToken.approve(address(this), _amount);
        require(success, "Approval failed");
    }
    

    function depositDai(uint _amount) public {
        uint allowance = daiToken.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the daiToken allowance");
        bool success = daiToken.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer failed");
    }
    function withdrawDai(uint256 _amount) public onlyOwner {
        require(daiToken.balanceOf(address(this)) >= _amount);
        daiToken.transfer(msg.sender, _amount);
    }

    function addTrustee(address _trustee) public onlyOwner {
        isTrustee[_trustee] = true;
        trustees.push(_trustee);
    }
    function removeTrustee(address _trustee, uint _index) public onlyOwner {
        require(_index < trustees.length, "index out of bound");
        isTrustee[_trustee] = false;
        address[] memory _trustees = trustees;
        for (uint i = _index; i < _trustees.length - 1; i++) {
            _trustees[i] = _trustees[i + 1];
        }
        trustees = _trustees;
        trustees.pop();
    }

    function getTrustees() public view returns(address[] memory) {
        return trustees;
    }
    function getBeneficiaries() public view returns(address[] memory) {
        return beneficiaries;
    }

    function checkUpkeep(bytes memory /* checkData */ ) public view override returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        ){
         if(block.timestamp - lastTimestamp[msg.sender] >= interval){
             upkeepNeeded = true;
         } else {
             upkeepNeeded = false;
         }
        }
    
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool enoughTimePassed, ) = checkUpkeep("");
        if(!enoughTimePassed){
            revert DecentralizedTrustFund_SufficentTimeNotElapsed();
        }
        daiToken.transfer(msg.sender, amountWithdrawable);
        lastTimestamp[msg.sender] = block.timestamp;
    }

    function depositEth() public payable {
        if(msg.value == 0){
            revert DecentralizedTrustFund_MustDepositValidAmount();
        }
        ethBalance += msg.value;
        addressToAmount[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function decode(bytes calldata data) private pure returns(string memory functionName){
       (functionName) = abi.decode(data, (string));
    }

    function depositToAave(bytes calldata _data, address _asset, address _target, uint256 _amount) public {
        require(isWhiteList[_target], "Target contract is not whitelisted");
        string memory funcName = decode(_data);
        (bool success, ) = _target.call{value: 0}(abi.encodeWithSignature(funcName, _asset, _amount, owner, 0));
        require(success, "Deposit to aave failed");
    }


    // curve/quickwap seem to be practically same so decision needs to be made which one to implement and which to leave 

    function depositToCurve(/*bytes calldata _data, address _asset, address _target, uint256 _amount*/) public {
    }

    function depositToQucickswap(/*bytes calldata _data, address _asset, address _target, uint256 _amount*/) public {
    }

 
    function getOwner() public view returns(address) {
        return owner;
    }
    
    fallback() external payable {
        depositEth();
    }

    receive() external payable {
        depositEth();
    }


}