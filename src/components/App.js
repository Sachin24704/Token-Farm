import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3'
import TokenFarm from '../abis/TokenFarm.json'
import FarmToken from '../abis/FarmToken.json'
import DaiToken from '../abis/DaiToken.json'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  // featching data brom bc to load inside state
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()


    // load farmtoken
    const farmtokenData = FarmToken.networks[networkId]
    if (farmtokenData) {
      const farmtoken = new web3.eth.Contract(FarmToken.abi, farmtokenData.address)
      this.setState({ farmtoken })
      let farmTokenBalance = await farmtoken.methods.balanceOf(this.state.account).call()
      this.setState({ farmTokenBalance: farmTokenBalance.toString() })
    }
    else {
      window.alert('FarmToken contract not deployed to the detected network')
    }

    // load dai token
    const daitokenData = DaiToken.networks[networkId]
    if (daitokenData) {
      const daitoken = new web3.eth.Contract(DaiToken.abi, daitokenData.address)
      this.setState({ daitoken })
      let daiTokenBalance = await daitoken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
    }
    else {
      window.alert('DaiToken contract not deployed to the detected network')
    }

    const tokenfarmData = TokenFarm.networks[networkId]
    if (tokenfarmData) {
      const tokenfarm = new web3.eth.Contract(TokenFarm.abi, tokenfarmData.address)
      this.setState({ tokenfarm })
      let stakingBalance = await tokenfarm.methods.stakedBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    }
    else {
      window.alert('TokenFarm contract not deployed to detected network')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-ethereum browser detected. You should consider using metamask!')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daitoken.methods.approve(this.state.tokenfarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenfarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenfarm.methods.unStake().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }



  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daitoken: {},
      farmtoken: {},
      tokenfarm: {},
      daiTokenBalance: '0',
      farmTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    }
    else {
      content = <Main
        daiTokenBalance={this.state.daiTokenBalance}
        farmTokenBalance={this.state.farmTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }



    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
