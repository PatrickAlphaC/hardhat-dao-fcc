// const  verify = require()
const { ethers } = require("hardhat")
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying TimeLock and waiting for confirmations...")
  const timelock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  //   \\ VERIFY
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   await verify(governanceToken.address, [])
  // }
}

module.exports.tags = ["all", "timeLock"]
