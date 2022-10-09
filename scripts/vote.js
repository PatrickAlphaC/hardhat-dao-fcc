const { ethers, network } = require("hardhat")
const { developmentChains, proposalsFile, VOTING_PERIOD } = require("../helper-hardhat-config")

const fs = require("fs-extra")
const { moveBlocks } = require("../utils/move-blocks")

const index = 0
const chainId = network.config.chainId

async function main(proposalIndex) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
  // You could swap this out for the ID you want to use too
  const proposalId = proposals[chainId][proposalIndex]
  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1
  // const reason = "I like this update very much!"
  await vote(proposalId, voteWay)
}

// 0 = Against, 1 = For, 2 = Abstain for this example
async function vote(proposalId, voteWay) {
  console.log("Voting...")
  const governor = await ethers.getContract("GovernorContract")
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1)
  }
  const voteTx = await governor.castVote(proposalId, voteWay)
  const voteTxReceipt = await voteTx.wait(1)
  // console.log(voteTxReceipt.events[0].args.reason)
  const proposalState = await governor.state(proposalId) // see the "state" function in openzeppelin Governor contract. It will show if it's active, executed, cancaled etc.
  // NOTE: To see the proposal state go to "IGovernor.sol" contract openzeppelin, There you'll see the enum ProposalState{}.
  console.log(`Current Proposal State: ${proposalState}`)
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 3)
  }
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
