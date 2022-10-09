const { ethers } = require("hardhat")
const { ADDRESS_ZERO } = require("../helper-hardhat-config")

/* NOTE: This Script will set the proposers and executors for timelock.sol */

module.exports = async function () {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await ethers.getContract("GovernanceToken", deployer)
  const timeLock = await ethers.getContract("TimeLock", deployer)
  const governor = await ethers.getContract("GovernorContract", deployer)

  log("----------------------------------------------------")
  log("Setting up contracts for roles...")
  // would be great to use multicall here...0
  const proposerRole = await timeLock.PROPOSER_ROLE()
  const executorRole = await timeLock.EXECUTOR_ROLE()
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

  // governor you are the only one who have power to propose something to timelock and Timelock is like- President, Which will pass the proposal
  const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
  await proposerTx.wait(1)

  // executor role to nobody, which means anyone can execute.
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
  await executorTx.wait(1)

  // If you would remember, We gave the deployer "Timelock_Admin_Role", Which is kinda centralized. This situation can work perfectly until We gave the Proposer_Role & Executor_Role.
  // And Since we gave the Proposer_Role & Executor_Role in above code. We can Revoke the admin of Timelock contract. Means Nobody should be the Admin of TimeLock, if you want a real Decentralized Dao.
  const revokeTx = await timeLock.revokeRole(adminRole, deployer)
  await revokeTx.wait(1)
  // Guess what? Now, anything the timelock wants to do has to go through the governance process!
}

// NOTE: Before Deploying this contract deploy the Box.sol, since we want to governor over this contract.
module.exports.tags = ["all", "setup"]
