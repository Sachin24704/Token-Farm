const TokenFarm = artifacts.require("TokenFarm")
const FarmToken = artifacts.require("FarmToken")
const DaiToken = artifacts.require("DaiToken")

module.exports = async function (deployer, network, accounts) {

    await deployer.deploy(FarmToken)
    const farmtoken = await FarmToken.deployed()

    await deployer.deploy(DaiToken)
    const daitoken = await DaiToken.deployed()

    await deployer.deploy(TokenFarm, farmtoken.address, daitoken.address)
    const tokenfarm = await TokenFarm.deployed()

    await farmtoken.transfer(tokenfarm.address, '1000000000000000000000000')
    await daitoken.transfer(accounts[1], '100000000000000000000')





}