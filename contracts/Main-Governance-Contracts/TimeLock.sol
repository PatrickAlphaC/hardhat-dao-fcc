// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title This contract will be the Owner of "Box.sol"
 * @dev We want to wait for a new vote to be "executed" becoz
 * Imagine => A Bad proposal will pass something like "Everyone who holds the governance token has to pay 5 tokens everyDay"
 * @dev So, in this case we have this contract which will "Give some time to users to Get Out if they don't like the governance update.
 * @dev Means THe update will not gonna excute just after the Proposal Passed.
 */

contract TimeLock is TimelockController {
  // minDelay: How long we have to wait before executing
  // proposers: Is the list of addresses that can propose (for this project anyone can propose)
  // executors: Who can execute when a proposal passes (for this project anyone can execute)
  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(minDelay, proposers, executors) {}
}
