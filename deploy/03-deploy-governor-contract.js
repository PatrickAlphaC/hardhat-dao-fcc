// const  verify = require()
const { ethers } = require("hardhat")
const {
  developmentChains,
  QUORUM_PERCENTAGE,
  VOTING_PERIOD,
  VOTING_DELAY,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  // const governanceToken = await ethers.getContract("GovernanceToken")
  const governanceToken = await get("GovernanceToken")

  // const timeLock = await ethers.getContract("TimeLock")
  const timeLock = await get("TimeLock")

  log("----------------------------------------------------")
  log("Deploying governorContract and waiting for confirmations...")
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      QUORUM_PERCENTAGE,
      VOTING_PERIOD,
      VOTING_DELAY,
    ],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  //   \\ VERIFY
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(governanceToken.address, [])
  // }
}

module.exports.tags = ["all", "governor"]
