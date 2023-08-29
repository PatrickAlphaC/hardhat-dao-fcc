import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments } = hre
  const { log } = deployments
  const { deployer } = await getNamedAccounts()
  const timeLock = await ethers.getContract("TimeLock", deployer)
  const governor = await ethers.getContract("GovernorContract", deployer)

  log("----------------------------------------------------")
  log("Setting up contracts for roles...")
  // would be great to use multicall here...
  const proposerRole = ethers.id("PROPOSER_ROLE");
  const executorRole = ethers.id("EXECUTOR_ROLE");
  const adminRole = ethers.id("TIMELOCK_ADMIN_ROLE")

  const proposerTx = await timeLock.getFunction("grantRole")(proposerRole, await governor.getAddress())
  await proposerTx.wait(1)
  const executorTx = await timeLock.getFunction("grantRole")(executorRole, ethers.ZeroAddress);
  await executorTx.wait(1)
  const revokeTx = await timeLock.getFunction("revokeRole")(adminRole, deployer)
  await revokeTx.wait(1)
  // Guess what? Now, anything the timelock wants to do has to go through the governance process!
}

export default setupContracts
setupContracts.tags = ["all", "setup"]
