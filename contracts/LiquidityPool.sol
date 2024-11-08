// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import './BLTMToken.sol';

contract LiquidityPool is AccessControl {
    BLTMToken public bltmToken;
    IERC20 public usdcToken;
    uint256 public exchangeRate;

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    constructor(BLTMToken _bltmToken, IERC20 _usdcToken, uint256 _exchangeRate) {
        bltmToken = _bltmToken;
        usdcToken = _usdcToken;
        exchangeRate = _exchangeRate > 0 ? _exchangeRate : 1;
        _grantRole(OWNER_ROLE, msg.sender);
    }

    function setExchangeRate(uint256 newRate) public onlyRole(OWNER_ROLE) {
        // Requirement 5: Update exchange rate
        exchangeRate = newRate;
    }

    function exchangeUSDCForBLTM(uint256 usdcAmount) public {
        require(usdcAmount > 0, "Amount must be positive");

        uint256 royalty = (usdcAmount * 2) / 100;
        uint256 netUsdc = usdcAmount - royalty;
        uint256 bltmAmount = netUsdc * exchangeRate;

        require(usdcToken.transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");
        bltmToken.mint(msg.sender, bltmAmount);
    }

    function exchangeBLTMForUSDC(uint256 bltmAmount) public {
        require(bltmAmount > 0, "Amount must be positive");

        uint256 usdcAmount = bltmAmount / exchangeRate;
        require(bltmToken.transferFrom(msg.sender, address(this), bltmAmount), "BLTM transfer failed");
        bltmToken.burn(bltmAmount);

        require(usdcToken.transfer(msg.sender, usdcAmount), "USDC transfer failed");
    }

    function withdrawUSDC(uint256 usdcAmount) public onlyRole(OWNER_ROLE) {
        require(usdcAmount > 0, "Amount must be positive");
        require(usdcToken.transfer(msg.sender, usdcAmount), "USDC transfer failed");
    }
}