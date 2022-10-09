module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying TimeLock and waiting for confirmations...")
  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log(`Box at ${box.address}`)

  // You can add your verification code here \\

  const boxContract = await ethers.getContractAt("Box", box.address)
  const timeLock = await ethers.getContract("TimeLock")

  // Now the owner of Box is TimeLock contract.
  const transferTx = await boxContract.transferOwnership(timeLock.address)
  await transferTx.wait(1)
}

module.exports.tags = ["all", "box"]
