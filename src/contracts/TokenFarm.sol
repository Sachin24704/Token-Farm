// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;
import "./FarmToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "TokenFarm";
    FarmToken public farmtoken;
    DaiToken public daitoken;
    address[] public stakers;
    mapping(address => uint256) public stakedBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public issuedTokens;

    constructor(FarmToken _farmtoken, DaiToken _daitoken) public {
        farmtoken = _farmtoken;
        daitoken = _daitoken;
    }

    // staking

    function stakeTokens(uint256 _amount) public {
        // transfer tokens to contract
        require(
            daitoken.balanceOf(msg.sender) >= _amount,
            " balance not sufficient"
        );
        daitoken.approve(address(this), _amount);
        daitoken.transferFrom(msg.sender, address(this), _amount);
        stakedBalance[msg.sender] = stakedBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;

        // transfer tokens
        farmtoken.transfer(msg.sender, _amount);
        issuedTokens[msg.sender] = issuedTokens[msg.sender] + _amount;
    }

    function unStake() public {
        uint256 balance = stakedBalance[msg.sender];
        require(balance > 0, "first stake to unstke");

        //unstaking
        daitoken.transfer(msg.sender, balance);
        //reset
        stakedBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    // unstaking
    // transfer farmtokens
}
