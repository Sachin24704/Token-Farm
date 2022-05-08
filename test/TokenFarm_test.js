const { assert } = require('chai');
const { default: Web3 } = require('web3');
// const { Item } = require('react-bootstrap/lib/Breadcrumb');
//const _deploy_contracts = require('../migrations/2_deploy_contracts');

const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const FarmToken = artifacts.require("FarmToken");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokenstowei(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {

    let daitoken, farmtoken, tokenfarm


    before(async () => {

        // deploying contracts
        daitoken = await DaiToken.new();
        farmtoken = await FarmToken.new();
        tokenfarm = await TokenFarm.new(farmtoken.address, daitoken.address);

        //transfering tokens

        await farmtoken.transfer(tokenfarm.address, tokenstowei('1000000'));
        await daitoken.transfer(investor, tokenstowei('100'), { from: owner });



    })

    //write test here
    describe('Mock Dai Deployment', async () => {
        it('has a name', async () => {

            var name = await daitoken.name();
            assert.equal(name, 'Mock DAI Token');
        })
    })

    describe('FarmToken Deployment', async () => {
        it('has a name', async () => {

            var name = await farmtoken.name();
            assert.equal(name, 'Farm Token');
        })
    })

    describe('Token Farm Deployment', async () => {
        it('has a name', async () => {

            var name = await tokenfarm.name();
            assert.equal(name, 'TokenFarm');
        })
        it('balance of contract', async () => {
            var balance = await farmtoken.balanceOf(tokenfarm.address)
            assert.equal(balance, tokenstowei('1000000'));
        })
    })

    describe('Staking in progress', async () => {
        it('balance', async () => {

            let result
            result = await daitoken.balanceOf(investor)
            assert.equal(result.toString(), tokenstowei('100'), 'investor mock dai wallet balance incorrect')
            // for staking- first approve then stake 
            await daitoken.approve(tokenfarm.address, tokenstowei('100'), { from: investor });
            await tokenfarm.stakeTokens(tokenstowei('100'), { from: investor });
            // check staking result
            result = await daitoken.balanceOf(investor)
            assert.equal(result.toString(), tokenstowei('0'), ' investor mock dai wallet balance incorrect after staking')

            result = await daitoken.balanceOf(tokenfarm.address)
            assert.equal(result.toString(), tokenstowei('100'), ' Token Farm Mock Dai Balance incorrect after staking')

            result = await tokenfarm.stakedBalance(investor)
            assert.equal(result.toString(), tokenstowei('100'), 'investor staking balance correct after staking');

            result = await tokenfarm.isStaking(investor)
            assert.equal(result, true, 'investor staking status incorrect after staking')

            var balance = await farmtoken.balanceOf(investor);
            assert.equal(balance.toString(), tokenstowei('100'), 'tokentransfer failed');

            tokenfarm.unStake({ from: investor });

            result = await daitoken.balanceOf(investor);
            assert.equal(result.toString(), tokenstowei('100'), 'unstaking not successful')

        })
    })





})