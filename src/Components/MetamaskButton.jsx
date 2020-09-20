import React from 'react';

export class MetamaskButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount(){
    this.onClickMetamask()
  }
  async onClickMetamask() {
    await this.loadWeb3()
    const me = this
    window.web3.eth.getAccounts(function(err, accounts){
      if (err != null) console.error("An error occurred: "+err);
      else if (accounts.length === 0) me.setState({user: ""})
      else me.setState({user: accounts[0]})
    });
    window.web3.eth.defaultAccount = window.web3.eth.accounts[0]
  }

  async loadWeb3() {
    const Web3 = require("web3");
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  } 
  render(){
    return <>
              {
                !this.props.user
                  ? <></>
                  : <></>
              }
          </>
  }
}